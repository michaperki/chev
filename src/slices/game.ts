
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameState: null,
  result: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGameState(state, action) {
      state.gameState = action.payload;
    },
    setGameResult(state, action) {
      state.result = action.payload;
    },
  },
});

export const { updateGameState, setGameResult } = gameSlice.actions;
export default gameSlice.reducer;
