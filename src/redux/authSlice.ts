import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../api/axios";
import type { AxiosError } from "axios";

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Add this to track if we've checked authentication
}

const initialState: AuthState = {
  user: null,
  loading: true, // Start with loading true
  error: null,
  isAuthenticated: false,
  isInitialized: false, // We haven't checked auth status yet
};

// Async thunk for login
export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axiosApi.post("/user/signin", credentials);
      return response.data.data; 
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data?.message || "Login failed"
      );
    }
  }
);

// Async thunk for session verification
export const verifyUserSession = createAsyncThunk(
  "auth/verifyUserSession",
  async (_, thunkAPI) => {
    try {
      const response = await axiosApi.get("/user/me"); 
      return response.data; 
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data?.message || "Session expired"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      axiosApi.defaults.headers.common["Authorization"] = "";
    },
    setAuthFromStorage(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.isAuthenticated = !!token;
      state.isInitialized = true;
      axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.loading = false;
        state.user = user;
        state.isAuthenticated = true;
        state.isInitialized = true;
        axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Unknown error";
        state.isInitialized = true;
      })
      .addCase(verifyUserSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isInitialized = true; // Mark as initialized
      })
      .addCase(verifyUserSession.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true; // Mark as initialized even on failure
        state.error = action.payload as string;
      });
  },
});

export const { logout, setAuthFromStorage } = authSlice.actions;
export const authReducer = authSlice.reducer;