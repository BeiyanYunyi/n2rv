import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import userAuthReducer from './userAuthSlice';
import replyReducer from './replySlice';
import pageReducer from './pageSlice';

export const store = configureStore({
  reducer: { auth: userAuthReducer, reply: replyReducer, page: pageReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
