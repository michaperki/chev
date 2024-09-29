
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/user'; // User slice
import sessionReducer from '../slices/session'; // Session slice
import participantReducer from '../slices/participant'; // Participant slice

export const store = configureStore({
  reducer: {
    user: userReducer,
    session: sessionReducer,
    participant: participantReducer, // Add participant slice
  },
});

// Types for the root state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

