import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for our auth state
export interface AuthState {
  isLoggedIn: boolean;
  user: string | null;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  error: null,
};

// Create the auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) => {
      const { username, password } = action.payload;

      // Simple authentication - check if credentials match
      if (username === "admin" && password === "admin") {
        state.isLoggedIn = true;
        state.user = username;
        state.error = null;
      } else {
        state.error = "Invalid username or password";
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const { login, logout, clearError } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
