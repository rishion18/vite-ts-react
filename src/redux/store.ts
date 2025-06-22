import { configureStore } from '@reduxjs/toolkit'
import { authApiSlice } from './authApiSlice'
import { chatApiSlice } from './chatApiSlice'

export const store  = configureStore({
    reducer:{
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [chatApiSlice.reducerPath]: chatApiSlice.reducer
    },
  // Add the API middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware, 
      chatApiSlice.middleware
    ),

})