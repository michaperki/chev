
// src/slices/user.ts
import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  walletAddress: string | null;
  connected: boolean;
}

const initialState: UserState = {
  walletAddress: null,
  connected: false, // New field for connection status
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connectUser: (state, action) => {
      state.walletAddress = action.payload.walletAddress;
      state.connected = true; // Update connected status
    },
    disconnectUser: (state) => {
      state.walletAddress = null;
      state.connected = false; // Update connected status
    },
  },
});

export const { connectUser, disconnectUser } = userSlice.actions;
export default userSlice.reducer;

