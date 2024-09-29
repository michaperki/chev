
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/user'; // User slice
import sessionReducer from '../slices/session'; // Session slice

export const store = configureStore({
  reducer: {
    user: userReducer, // Add user slice
    session: sessionReducer, // Add session slice
  },
});

// Types for the root state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

