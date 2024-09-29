
// src/slices/user.ts
import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  walletAddress: string | null;
  userId: number | null; // Store userId (Prisma user ID)
  playerId: string | null; // Store playerId (Virtual Labs ID)
  connected: boolean;
}

const initialState: UserState = {
  walletAddress: null,
  userId: null, // This is your local Prisma userId
  playerId: null, // This is the playerId from Virtual Labs
  connected: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connectUser: (state, action) => {
      state.walletAddress = action.payload.walletAddress;
      state.userId = action.payload.userId; // Store userId
      state.playerId = action.payload.playerId; // Store playerId
      state.connected = true;
    },
    disconnectUser: (state) => {
      state.walletAddress = null;
      state.userId = null;
      state.playerId = null;
      state.connected = false;
    },
  },
});

export const { connectUser, disconnectUser } = userSlice.actions;
export default userSlice.reducer;

