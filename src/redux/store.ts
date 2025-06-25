import { configureStore } from '@reduxjs/toolkit'
import { authApiSlice } from './authApiSlice'
import { chatApiSlice } from './chatApiSlice'
import { authReducer } from "./authSlice"; 
import { chatReducer } from "./chatSlice";


export const store  = configureStore({
    reducer:{
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [chatApiSlice.reducerPath]: chatApiSlice.reducer,
        auth: authReducer, 
        chat: chatReducer
    },
  // Add the API middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware, 
      chatApiSlice.middleware
    ),

})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;