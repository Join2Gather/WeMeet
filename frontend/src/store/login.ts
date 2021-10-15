import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/api';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type { Login } from '../interface';

const initialState: Login = {
	id: 0,
	name: '',
	user: 0,
	token: '',
	clubs: [],
	dates: [],
};
// const GET_POST = 'sample/GET_POST';
// const GET_USERS = 'sample/GET_USERS';

// export const getPost = createAction(GET_POST, (id: number) => id);
// export const getUsers = createAction(GET_USERS);

// const getPostSaga = createRequestSaga(GET_POST, api.getPost);
// const getUsersSaga = createRequestSaga(GET_USERS, api.getUsers);

// export function* sampleSaga() {
// 	yield takeLatest(GET_POST, getPostSaga);
// 	yield takeLatest(GET_USERS, getUsersSaga);
// }

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		// GET_POST_SUCCESS: (state, action: PayloadAction<any>) => {
		// 	state.post = action.payload;
		// },
		// GET_USERS_SUCCESS: (state, action: PayloadAction<any>) => {
		// 	state.users = action.payload;
		// },
		getSocialLogin: (state, action: PayloadAction<Login>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.clubs = action.payload.clubs;
			state.clubs.map((club) => {
				club.name = decodeURIComponent(club.name);
			});
			state.dates = action.payload.dates;
		},
	},
	extraReducers: {},
});

export const { getSocialLogin } = loginSlice.actions;

export default loginSlice.reducer;
