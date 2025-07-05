import type { Types } from "mongoose";

declare global {
  type ChatRoomType = 'group' | 'duplex' | 'broadcast';
  type ChatRoomRole = 'admin' | 'member' | 'superAdmin';

  interface ChatRoomUser {
    userId: Types.ObjectId;
    role: ChatRoomRole;
    avatar: string;
    userName: string;
  }

  type MessageType =
    | "text"
    | "image"
    | "video"
    | "audio"
    | "file"
    | "location"
    | "poll"
    | "sticker"
    | "gif";

  interface Message {
    _id: Types.ObjectId;
    chatRoomId: Types.ObjectId;
    sender: Types.ObjectId;
    receiver: Types.ObjectId[];
    text?: string;
    type: MessageType;
    fileUrl?: string;
    deletedFor: Types.ObjectId[];
    readBy: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface ChatRoom {
    _id: Types.ObjectId;
    type: ChatRoomType;
    users: ChatRoomUser[];
    participants: Types.ObjectId[];
    latestMessage?: Message;
    createdAt: Date;
    updatedAt: Date;
  }
}

export {};
