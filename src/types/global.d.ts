import { Types } from "mongoose";

type ChatRoomType = 'group' | 'duplex' | 'broadcast';
type ChatRoomRole = 'admin' | 'member' | 'superAdmin';

interface ChatRoomUser {
  userId: Types.ObjectId;
  role: ChatRoomRole;
}

interface ChatRoom {
  _id: Types.ObjectId;
  type: ChatRoomType;
  users: ChatRoomUser[];
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
