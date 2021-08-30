import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createRequestSaga } from '../hooks';
import * as api from '../lib/api/login';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type { Login, User } from '../interface/login';

const initialState: Login = {
	id: '',
	pw: '',
	token: '',
	loginError: '',
};

const GET_LOGIN = 'login/GET_LOGIN';

export const getLogin = createAction(GET_LOGIN, (user: User) => user);

const getLoginSaga = createRequestSaga(GET_LOGIN, api.getLogin);

export function* loginSaga() {
	yield takeLatest(GET_LOGIN, getLoginSaga);
}

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		initialLogin: (state) => {
			state.id = '';
			state.pw = '';
			state.loginError = '';
			state.token = '';
		},
		GET_LOGIN_SUCCESS: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
		GET_LOGIN_FAILURE: (state, action: PayloadAction<any>) => {
			state.loginError = 'fail';
		},
		setIdPw: (state, action: PayloadAction<User>) => {
			state.id = action.payload.id;
			state.pw = action.payload.pw;
		},
	},
	extraReducers: {},
});

export const { GET_LOGIN_SUCCESS, GET_LOGIN_FAILURE, initialLogin, setIdPw } =
	loginSlice.actions;

export default loginSlice.reducer;
