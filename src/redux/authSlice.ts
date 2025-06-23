import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../api/axios";
import type { AxiosError } from "axios";

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunk for login
export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axiosApi.post("/user/signin", credentials);
      console.log("Response from signInUser:", response);
      return response.data.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(axiosError.response?.data?.message || "Login failed");
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
      axiosApi.defaults.headers.common["Authorization"] = "";
    },
    setAuthFromStorage(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.isAuthenticated = !!token;
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
        console.log('data:', action.payload)
        const { user, token } = action.payload;
        console.log("User signed in:", user);
        console.log("Token received:", token);
        state.loading = false;
        state.user = user;
        state.isAuthenticated = true;
        axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Unknown error";
      });
  },
});

export const { logout, setAuthFromStorage } = authSlice.actions;
export const authReducer = authSlice.reducer;
