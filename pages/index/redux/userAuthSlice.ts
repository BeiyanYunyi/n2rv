/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit/';
import UserType from '../../../types/UserType';

export type AuthState =
  | {
      type: 'Authenticated';
      currentUser: Pick<UserType, 'id' | 'username' | 'avatar' | 'nickname'>;
    }
  | { type: 'Unauthenticated' };

const initialState: AuthState = { type: 'Unauthenticated' };

export const userAuthSlice = createSlice<AuthState, SliceCaseReducers<AuthState>>({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      _state,
      action: PayloadAction<Pick<UserType, 'id' | 'username' | 'avatar' | 'nickname'>>,
    ) => ({ type: 'Authenticated', currentUser: action.payload }),
    logout: (state) => {
      state.type = 'Unauthenticated';
    },
  },
});

export const { login, logout } = userAuthSlice.actions;

export default userAuthSlice.reducer;
