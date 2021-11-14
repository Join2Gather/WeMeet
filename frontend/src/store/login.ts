import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/login';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type { Login, userMeAPI } from '../interface';

const initialState: Login = {
	id: 0,
	name: '',
	user: 0,
	token: '',
	clubs: [],
	kakaoDates: [],
	uri: '',
	error: '',
	color: '',
};

const USER_ME = 'login/USER_ME';

export const getUserMe = createAction(USER_ME, (data: userMeAPI) => data);

const getUserMeSaga = createRequestSaga(USER_ME, api.getUserMe);

export function* loginSaga() {
	yield takeLatest(USER_ME, getUserMeSaga);
}

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		getSocialLogin: (state, action: PayloadAction<Login>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.clubs = action.payload.clubs;
			state.clubs.map((club) => {
				club.name = decodeURIComponent(club.name);
			});
			state.kakaoDates = action.payload.kakaoDates[0];
		},
		findURI: (state, action: PayloadAction<string>) => {
			const data = state.clubs.find((club) => club.name === action.payload);
			if (data) {
				state.uri = data.uri;
				state.color = data.color;
			}
		},
		USER_ME_SUCCESS: (state, action: PayloadAction<any>) => {
			state.clubs = action.payload.clubs;
			state.clubs.map((club) => {
				club.name = decodeURIComponent(club.name);
			});
		},
		USER_ME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		putURI: (state, action: PayloadAction<string>) => {
			state.uri = action.payload;
		},
	},
	extraReducers: {},
});

export const { getSocialLogin, findURI, putURI } = loginSlice.actions;

export default loginSlice.reducer;
