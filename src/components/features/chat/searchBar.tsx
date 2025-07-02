import {
  TextField,
  InputAdornment,
  Avatar,
  List,
  ListItem,
  Box,
  Typography,
  IconButton,
  Fade,
  Paper,
  Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";

interface SearchBarProps {}

type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  lastSeen?: string;
  isOnline?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced handler using useCallback to persist across renders
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      console.log("Debounced search value:", value);
      const dummyResults: User[] = [
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          avatar: "https://i.pravatar.cc/150?img=3",
          lastSeen: "2 hours ago",
          isOnline: true
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          avatar: "https://i.pravatar.cc/150?img=4",
          lastSeen: "1 day ago",
          isOnline: false
        },
        {
          _id: "3",
          name: "Mike Johnson",
          email: "mike@example.com",
          avatar: "https://i.pravatar.cc/150?img=5",
          lastSeen: "5 minutes ago",
          isOnline: true
        },
      ];
      
      // Filter results based on search term
      const filteredResults = value 
        ? dummyResults.filter(user => 
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
          )
        : [];
      
      setSearchResults(filteredResults);
    }, 300),
    []
  );

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSearchFocus = (e: React.FocusEvent) => {
    e.stopPropagation();
    setIsSearchFocused(true);
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Delay blur to allow for click events on search results
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 150);
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchTerm("");
    setSearchResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleUserSelect = (user: User, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Selected user:", user);
    // Handle user selection logic here
    setSearchTerm("");
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchFocused]);

  const showResults = isSearchFocused && (searchTerm.length > 0 || searchResults.length > 0);

  return (
    <Box ref={searchContainerRef} sx={{ position: "relative", zIndex: 1000 }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        variant="outlined"
        placeholder="Search or start new chat"
        value={searchTerm}
        onChange={onChangeSearch}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "rgba(255, 255, 255, 0.15)",
            borderRadius: "25px",
            fontSize: "0.9rem",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.25)",
            },
            "&.Mui-focused": {
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: "#333",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                borderWidth: "1px",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
              borderWidth: "1px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
          },
          "& .MuiInputBase-input": {
            color: "white",
            "&::placeholder": {
              color: "rgba(255, 255, 255, 0.7)",
              opacity: 1,
            },
            "&.Mui-focused": {
              color: "#333",
              "&::placeholder": {
                color: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                sx={{ 
                  color: isSearchFocused ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.7)",
                  fontSize: "1.2rem"
                }} 
              />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={clearSearch}
                sx={{ 
                  color: isSearchFocused ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.7)",
                  p: 0.5
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Fade in={showResults} timeout={200}>
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            maxHeight: 400,
            overflowY: "auto",
            bgcolor: "white",
            borderRadius: "12px",
            zIndex: 1001,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,0,0,0.05)",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1", 
              borderRadius: "3px",
            },
          }}
        >
          {searchTerm && searchResults.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "#8696a0"
              }}
            >
              <PersonAddIcon sx={{ fontSize: "2rem", mb: 1, opacity: 0.5 }} />
              <Typography variant="body2">
                No users found for "{searchTerm}"
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                Try searching with a different name or email
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {searchResults.map((user, index) => (
                <Box key={user._id}>
                  <ListItem
                    onClick={(e) => handleUserSelect(user, e)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      "&:hover": {
                        bgcolor: "#f0f2f5",
                        transform: "translateX(2px)",
                      },
                      "&:active": {
                        bgcolor: "#e3f2fd",
                      }
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      width="100%"
                      gap={1.5}
                    >
                      <Box sx={{ position: "relative" }}>
                        <Avatar 
                          src={user.avatar} 
                          sx={{ 
                            width: 45, 
                            height: 45,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                          }}
                        />
                        {user.isOnline && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 2,
                              right: 2,
                              width: 12,
                              height: 12,
                              bgcolor: "#4caf50",
                              borderRadius: "50%",
                              border: "2px solid white",
                              boxShadow: "0 0 0 1px rgba(0,0,0,0.1)"
                            }}
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: "#111b21",
                            fontSize: "0.95rem",
                            mb: 0.5
                          }}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#667781",
                            fontSize: "0.8rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {user.email}
                        </Typography>
                        {user.lastSeen && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: user.isOnline ? "#4caf50" : "#8696a0",
                              fontSize: "0.75rem",
                              display: "block",
                              mt: 0.2
                            }}
                          >
                            {user.isOnline ? "Online" : `Last seen ${user.lastSeen}`}
                          </Typography>
                        )}
                      </Box>

                      <IconButton
                        size="small"
                        sx={{ 
                          color: "#00d4aa",
                          opacity: 0.7,
                          "&:hover": {
                            opacity: 1,
                            bgcolor: "rgba(0, 212, 170, 0.1)"
                          }
                        }}
                      >
                        <PersonAddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                  
                  {index < searchResults.length - 1 && (
                    <Divider sx={{ mx: 2, opacity: 0.3 }} />
                  )}
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default SearchBar;