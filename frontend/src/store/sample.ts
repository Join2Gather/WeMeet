import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/api';
import {takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';

export interface Sample {
  post: any;
  users: any[];
}

const initialState: Sample = {
  post: [],
  users: [],
};
const GET_POST = 'sample/GET_POST';
const GET_USERS = 'sample/GET_USERS';

export const getPost = createAction(GET_POST, (id: number) => id);
export const getUsers = createAction(GET_USERS);

const getPostSaga = createRequestSaga(GET_POST, api.getPost);
const getUsersSaga = createRequestSaga(GET_USERS, api.getUsers);

export function* sampleSaga() {
  yield takeLatest(GET_POST, getPostSaga);
  yield takeLatest(GET_USERS, getUsersSaga);
}

export const sampleSlice = createSlice({
  name: 'sample',
  initialState,
  reducers: {
    GET_POST_SUCCESS: (state, action: PayloadAction<any>) => {
      state.post = action.payload;
    },
    GET_USERS_SUCCESS: (state, action: PayloadAction<any>) => {
      state.users = action.payload;
    },
  },
  extraReducers: {},
});

export const {GET_POST_SUCCESS, GET_USERS_SUCCESS} = sampleSlice.actions;

export default sampleSlice.reducer;
