import { configureStore } from "@reduxjs/toolkit";
import peopleReducer from "./peopleSlice";
import transactionReducer from "./transactionSlice";
import userReducer from "./userSlice";
import authReducer from "./authSlice";
import subscriptionReducer from "./subscriptionSlice";

export const store = configureStore({
  reducer: {
    people: peopleReducer,
    transactions: transactionReducer,
    user: userReducer,
    auth: authReducer,
    subscriptions: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
