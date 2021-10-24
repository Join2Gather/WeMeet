import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/individual';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type {
	requestTeamAPI,
	responseTeamAPI,
	state_time,
	team,
	postImageAPI,
	individual,
	responseImageAPI,
} from '../interface';

const POST_IMAGE = 'individual/POST_IMAGE';
const LOGIN_EVERYTIME = 'individual/LOGIN_EVERYTIME';

export const postImage = createAction(POST_IMAGE, (data: postImageAPI) => data);
export const loginEveryTime = createAction(LOGIN_EVERYTIME);

const postImageSaga = createRequestSaga(POST_IMAGE, api.postImage);
const loginEverySaga = createRequestSaga(LOGIN_EVERYTIME, api.loginEveryTime);

export function* individualSaga() {
	yield takeLatest(POST_IMAGE, postImageSaga);
	yield takeLatest(LOGIN_EVERYTIME, loginEverySaga);
}

const initialState: individual = {
	dates: {
		sun: { time: [] },
		mon: { time: [] },
		tue: { time: [] },
		thu: { time: [] },
		wed: { time: [] },
		fri: { time: [] },
		sat: { time: [] },
	},
	error: '',
};

export const individualSlice = createSlice({
	name: 'individual',
	initialState,
	reducers: {
		POST_IMAGE_SUCCESS: (state, action: PayloadAction<responseImageAPI>) => {
			state.dates.mon.time = action.payload.mon;
			state.dates.tue.time = action.payload.tue;
			state.dates.wed.time = action.payload.wed;
			state.dates.thu.time = action.payload.thu;
			state.dates.fri.time = action.payload.fri;
			state.dates.sat.time = action.payload.sat;
			state.dates.sun.time = action.payload.sun;
		},
		POST_IMAGE_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		LOGIN_EVERYTIME_SUCCESS: (state, action: PayloadAction<any>) => {
			console.log(action.payload);
		},
		LOGIN_EVERYTIME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
	},
	extraReducers: {},
});

export const {} = individualSlice.actions;

export default individualSlice.reducer;
