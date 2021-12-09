/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ReplyState = {
  replyTo: string | undefined;
};

const initialState: ReplyState = { replyTo: undefined };

export const replySlice = createSlice({
  name: 'reply',
  initialState,
  reducers: {
    replyTo: (state, action: PayloadAction<string>) => {
      state.replyTo = action.payload;
    },
    cancel: (state) => {
      state.replyTo = undefined;
    },
  },
});

export const { replyTo, cancel } = replySlice.actions;

export default replySlice.reducer;
