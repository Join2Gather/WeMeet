import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/individual';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type {
	postImageAPI,
	individual,
	responseImageAPI,
	make_days,
	postEveryTimeAPI,
} from '../interface';
import { Colors } from 'react-native-paper';

const POST_IMAGE = 'individual/POST_IMAGE';
const LOGIN_EVERYTIME = 'individual/LOGIN_EVERYTIME';
const POST_EVERYTIME = 'individual/POST_EVERYTIME';

export const postImage = createAction(POST_IMAGE, (data: postImageAPI) => data);
export const loginEveryTime = createAction(LOGIN_EVERYTIME);
export const postEveryTime = createAction(
	POST_EVERYTIME,
	(data: postEveryTimeAPI) => data
);

const postImageSaga = createRequestSaga(POST_IMAGE, api.postImage);
const loginEverySaga = createRequestSaga(LOGIN_EVERYTIME, api.loginEveryTime);
const postEveryTimeSaga = createRequestSaga(POST_EVERYTIME, api.postEveryTime);

export function* individualSaga() {
	yield takeLatest(POST_IMAGE, postImageSaga);
	yield takeLatest(LOGIN_EVERYTIME, loginEverySaga);
	yield takeLatest(POST_EVERYTIME, postEveryTimeSaga);
}

const initialState: individual = {
	individualDates: [
		{ day: 'sun', times: [] },
		{ day: 'mon', times: [] },
		{ day: 'tue', times: [] },
		{ day: 'thu', times: [] },
		{ day: 'wed', times: [] },
		{ day: 'fri', times: [] },
		{ day: 'sat', times: [] },
	],
	error: '',
	everyTime: {
		sun: [],
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: [],
	},
	weekIndex: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
	loginSuccess: false,
	cloneDateSuccess: false,
};

export const individualSlice = createSlice({
	name: 'individual',
	initialState,
	reducers: {
		POST_IMAGE_SUCCESS: (state, action: PayloadAction<responseImageAPI>) => {},
		POST_IMAGE_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		kakaoLogin: (state, action: PayloadAction<any>) => {
			if (state.cloneDateSuccess) {
				state.everyTime = action.payload;
				state.weekIndex.map((day, idx) =>
					state.everyTime[day].map((d) => {
						state.individualDates[idx].times.map((inDay) => {
							if (d.starting_hours === inDay.time) {
								for (let i = d.starting_hours - 8; i <= d.end_hours - 8; i++) {
									if (i + 8 == d.starting_hours) {
										state.individualDates[idx].times[i].color = Colors.grey400;
										state.individualDates[idx].times[i].isFullTime = true;
										state.individualDates[idx].times[i].startPercent =
											(1 - d.starting_minutes / 60) * 100;
										state.individualDates[idx].times[i].mode = 'start';
									} else if (i + 8 == d.end_hours) {
										state.individualDates[idx].times[i].color = Colors.grey400;
										state.individualDates[idx].times[i].isFullTime = true;
										state.individualDates[idx].times[i].endPercent =
											(d.end_minutes / 60) * 100;
										state.individualDates[idx].times[i].mode = 'end';
									} else {
										state.individualDates[idx].times[i].color = Colors.grey400;
										state.individualDates[idx].times[i].isFullTime = true;
									}
								}
							}
						});
					})
				);
			}
		},
		LOGIN_EVERYTIME_SUCCESS: (state, action: PayloadAction<any>) => {
			state.everyTime = action.payload;
			state.loginSuccess = true;
			state.weekIndex.map((day, idx) =>
				state.everyTime[day].map((d) => {
					state.individualDates[idx].times.map((inDay) => {
						if (d.starting_hours === inDay.time) {
							for (let i = d.starting_hours - 8; i <= d.end_hours - 8; i++) {
								if (i + 8 == d.starting_hours) {
									state.individualDates[idx].times[i].color = Colors.grey400;
									state.individualDates[idx].times[i].isFullTime = true;
									state.individualDates[idx].times[i].startPercent =
										(1 - d.starting_minutes / 60) * 100;
									state.individualDates[idx].times[i].mode = 'start';
								} else if (i + 8 == d.end_hours) {
									state.individualDates[idx].times[i].color = Colors.grey400;
									state.individualDates[idx].times[i].isFullTime = true;
									state.individualDates[idx].times[i].endPercent =
										(d.end_minutes / 60) * 100;
									state.individualDates[idx].times[i].mode = 'end';
								} else {
									state.individualDates[idx].times[i].color = Colors.grey400;
									state.individualDates[idx].times[i].isFullTime = true;
								}
							}
						}
					});
				})
			);
		},
		LOGIN_EVERYTIME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		cloneIndividualDates: (state, action: PayloadAction<make_days[]>) => {
			state.individualDates = action.payload;
			state.cloneDateSuccess = true;
		},
		POST_EVERYTIME_SUCCESS: (state, action: PayloadAction<any>) => {
			console.log(action.payload);
			state.loginSuccess = false;
		},
		POST_EVERYTIME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
	},
	extraReducers: {},
});

export const { cloneIndividualDates, LOGIN_EVERYTIME_SUCCESS, kakaoLogin } =
	individualSlice.actions;

export default individualSlice.reducer;
