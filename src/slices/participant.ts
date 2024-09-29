
// src/slices/participant.ts

import { createSlice } from '@reduxjs/toolkit';

interface ParticipantState {
  participantId: string | null;
  balance: string | null;
}

const initialState: ParticipantState = {
  participantId: null,
  balance: null,
};

const participantSlice = createSlice({
  name: 'participant',
  initialState,
  reducers: {
    updateParticipant: (state, action) => {
      state.participantId = action.payload.participantId;
      state.balance = action.payload.balance;
    },
    clearParticipant: (state) => {
      state.participantId = null;
      state.balance = null;
    },
  },
});

export const { updateParticipant, clearParticipant } = participantSlice.actions;
export default participantSlice.reducer;
