import {
  Box,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { useSocket } from "../../../socket/socketProvider";
import ChatBubble from "./chatBubble";
import {
  addNewMessage,
  setMessages,
  getMessages,
} from "../../../redux/chatSlice";

const PAGE_SIZE = 20;

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();

  const {
    chatRoom: currentRoom,
    messages,
    messageLoading,
    pagination,
  } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const socket = useSocket();

  // Ref to track when initial load is done
  const initialLoadDone = useRef(false);

  // 1️⃣ Fetch messages using cursor
  const fetchMessages = useCallback(
    (cursor: string | null) => {
      if (!currentRoom?._id) return;
      // Clear the “initial” flag only when we explicitly pass null (first load)
      if (cursor === null) {
        initialLoadDone.current = false;
        dispatch(setMessages({ prepend: false, messages: [] }));
      }
      dispatch(
        getMessages({
          chatRoomId: currentRoom._id,
          cursor,
          limit: PAGE_SIZE,
        })
      ).then(() => {
        // mark that initial batch finished
        if (cursor === null) initialLoadDone.current = true;
      });
    },
    [currentRoom?._id, dispatch]
  );

  useEffect(() => {
    if(Array.isArray(messages) && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages])

  // 2️⃣ Initial load on room change
  useEffect(() => {
    if (!currentRoom?._id) return;
    fetchMessages(null);
    // scroll to bottom after that first batch
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  }, [currentRoom?._id, fetchMessages]);

  // 3️⃣ Scroll‑up pagination
  const handleScroll = () => {
    if (
      !scrollRef.current ||
      messageLoading ||
      !pagination?.hasMore ||
      !pagination?.nextCursor
    )
      return;
    if (scrollRef.current.scrollTop < 5) {
      const prevHeight = scrollRef.current.scrollHeight;
      fetchMessages(pagination.nextCursor);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop =
            scrollRef.current.scrollHeight - prevHeight;
        }
      }, 100);
    }
  };

    const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  // 4️⃣ Socket listener for truly new messages
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (data: any) => {
      // Only inject if we’ve finished the first load
      if (!initialLoadDone.current) return;
     console.log('message in box', data.message);
      const mb = {
        _id: data.message._id,
        text: data.message.text,
        sender: data.message.sender,
        createdAt: data.message.createdAt,
        type: data.message.type,
        fileUrl: data.message.fileUrl,
        reciever: data.message.reciever,
      };
      // don’t double-add
      if(mb.sender !== user?.id){
        dispatch(addNewMessage(data.message));
        scrollToBottom();
      } 
    };

    socket.on("messageInRoom", handleIncomingMessage);
    return () => {
      socket.off("messageInRoom", handleIncomingMessage);
    };
  }, [socket, dispatch]);

  // 5️⃣ Sort & dedupe before render
  const sortedMessages = useMemo(() => {
    const sorted = [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    // dedupe by _id
    const seen = new Set<string>();
    return sorted.filter((m) => {
      if (seen.has(m._id)) return false;
      seen.add(m._id);
      return true;
    });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  // 6️⃣ Send message
  const handleSend = () => {
    if (!message.trim()) return;
    const mb = {
      _id: Date.now().toString(),
      text: message,
      type: "text",
      fileUrl: "",
      sender: user?.id,
      reciever: currentRoom?.participants,
      createdAt: new Date().toISOString(),
    };
    socket.emit("sendMessage", {
      chatRoomId: currentRoom?._id,
      message: mb,
      participants: currentRoom?.participants,
    });
    dispatch(addNewMessage(mb));
    setMessage("");
    setFile(null);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <Box flex={1} display="flex" flexDirection="column" height="100%">
      <Box
        flex={1}
        p={2}
        overflow="auto"
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ height: "100%", minHeight: 0 }}
      >
        {messageLoading && (
          <Box display="flex" justifyContent="center" my={1}>
            <Typography variant="caption" color="textSecondary">
              Loading...
            </Typography>
            <CircularProgress size={20} style={{ marginLeft: 8 }} />
          </Box>
        )}
        {!pagination?.hasMore && (
          <Box display="flex" justifyContent="center" my={1}>
            <Typography variant="caption" color="textSecondary">
              -- end --
            </Typography>
          </Box>
        )}

        {/* Only render once user.id is known, to avoid side-flip */}
        {user?.id &&
          sortedMessages.map((msg) => (
            <ChatBubble
              key={msg._id}
              message={msg}
              currentUserId={user.id}
            />
          ))}
      </Box>

      <Box
        p={2}
        borderTop={`1px solid ${theme.palette.divider}`}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <input
          accept="*"
          style={{ display: "none" }}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <IconButton component="span">
            <AttachFileIcon />
          </IconButton>
        </label>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: file && (
              <InputAdornment position="end">
                <Typography variant="caption" color="primary">
                  {file.name}
                </Typography>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={!message && !file}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
