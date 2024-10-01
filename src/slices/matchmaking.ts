
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queue: [],
  matchInfo: null,
};

const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {
    addToQueue(state, action) {
      state.queue.push(action.payload);
    },
    setMatchInfo(state, action) {
      state.matchInfo = action.payload;
    },
  },
});

export const { addToQueue, setMatchInfo } = matchmakingSlice.actions;
export default matchmakingSlice.reducer;
