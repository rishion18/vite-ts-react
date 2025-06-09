import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Update with your backend URL

export const socket = io(SOCKET_URL, {
  autoConnect: false, 
  withCredentials: true,
  auth:{
    token: localStorage.getItem('token') || ''
  }
});