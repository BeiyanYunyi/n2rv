/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import { TopicWhileGetAll } from '../../../types/Topic';

export type PageState = {
  needDeleted: boolean;
  needElite: boolean;
  needOriginal: boolean;
  page: number;
  lastPage: number;
  loading: boolean;
  topicList: TopicWhileGetAll[];
};

const initialState: PageState = {
  needDeleted: false,
  needElite: false,
  needOriginal: false,
  page: 1,
  lastPage: 1,
  loading: false,
  topicList: [],
};

export const fetchTopics = createAsyncThunk('page/fetchTopics', async (_arg, thunkAPI) => {
  const pageState = (thunkAPI.getState() as { page: PageState }).page;
  const res = await apiWrapper.getTopics({
    page: pageState.page,
    needDeleted: pageState.needDeleted,
    needElite: pageState.needElite,
    needOriginal: pageState.needOriginal,
  });
  return res;
});

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setNeedDeleted: (state, action: PayloadAction<boolean>) => {
      state.needDeleted = action.payload;
    },
    setNeedElite: (state, action: PayloadAction<boolean>) => {
      state.needElite = action.payload;
    },
    setNeedOriginal: (state, action: PayloadAction<boolean>) => {
      state.needOriginal = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLastPage: (state, action: PayloadAction<number>) => {
      state.lastPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTopics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTopics.fulfilled, (state, action) => {
      state.topicList = action.payload.topicList;
      state.lastPage = action.payload.pages;
      state.loading = false;
    });
  },
});

export const { setNeedDeleted, setNeedElite, setNeedOriginal, setPage, setLastPage } =
  pageSlice.actions;

export default pageSlice.reducer;
