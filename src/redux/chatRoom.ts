// import { createSlice } from "@reduxjs/toolkit"
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";


// const initialState = {
    
// }

// const chatRoomSlice = createSlice({
//     name: 'chatRoom',
//     initialState,
//     reducers: {},
//     extraReducers:(builder) => {
//         // Add your extra reducers here if needed
//         // For example, you can handle actions from chatApiSlice here
    
//     }
// })

// export const fetchChatRooms = createAsyncThunk(
//   "chatRoom/fetchChatRooms",
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.get("/api/chat-rooms"); // Replace with your actual API
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );



// export const { actions, reducer } = chatRoomSlice
