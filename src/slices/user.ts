import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  walletAddress: string | null;
  userId: string | null;
  playerId: string | null;
  connected: boolean;
  lichessUsername: string | null;
  lichessAccessToken: string | null;
}

const initialState: UserState = {
  walletAddress: null,
  userId: null,
  playerId: null,
  connected: false,
  lichessUsername: null,
  lichessAccessToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connectUser: (state, action) => {
      state.walletAddress = action.payload.walletAddress;
      state.userId = action.payload.userId;
      state.playerId = action.payload.playerId;
      state.connected = true;
    },
    setLichessData: (state, action) => {
      state.lichessUsername = action.payload.lichessUsername;
      state.lichessAccessToken = action.payload.lichessAccessToken;
    },
    disconnectUser: (state) => {
      state.walletAddress = null;
      state.userId = null;
      state.playerId = null;
      state.connected = false;
      state.lichessUsername = null;
      state.lichessAccessToken = null;
    },
  },
});

export const { connectUser, setLichessData, disconnectUser } = userSlice.actions;
export default userSlice.reducer;

