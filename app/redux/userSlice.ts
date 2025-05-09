import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Type definitions
export type UserState = {
  balance: number;
  name: string;
};

// Initial state
const initialState: UserState = {
  balance: 1000, // Starting with 1000 crypto units
  name: "User",
};

// Create the slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Update user balance
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    // Deduct amount from balance
    deductFromBalance: (state, action: PayloadAction<number>) => {
      state.balance -= action.payload;
    },
    // Add amount to balance
    addToBalance: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
    },
  },
});

// Export actions and reducer
export const { updateBalance, deductFromBalance, addToBalance } =
  userSlice.actions;
export default userSlice.reducer;
