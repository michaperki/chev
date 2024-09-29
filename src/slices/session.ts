
// src/slices/session.ts
import { createSlice } from '@reduxjs/toolkit';

interface SessionState {
  sessionId: string | null;
  balance: string | null;
  status: string | null;
}

const initialState: SessionState = {
  sessionId: null,
  balance: null,
  status: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    updateSession: (state, action) => {
      state.sessionId = action.payload.sessionId;
      state.balance = action.payload.balance;
      state.status = action.payload.status;
    },
    clearSession: (state) => {
      state.sessionId = null;
      state.balance = null;
      state.status = null;
    },
  },
});

export const { updateSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;

