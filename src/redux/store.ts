import { configureStore } from '@reduxjs/toolkit'
import { authApiSlice } from './authApiSlice'

export const store  = configureStore({
    reducer:{
        [authApiSlice.reducerPath]: authApiSlice.reducer,
    },
  // Add the API middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware),
})