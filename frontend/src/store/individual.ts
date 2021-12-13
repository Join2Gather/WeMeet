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
import { useMakeTimeTableWith60 } from '../hooks';
import { makeHomeTimetable } from '../lib/util';

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

const { defaultDatesWith60, timesText } = useMakeTimeTableWith60(0, 25);

const initialState: individual = {
	individualDates: defaultDatesWith60,
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
	confirmDatesTimetable: [],
	confirmClubs: [],
	individualTimesText: timesText,
	startTime: {
		hour: 0,
		minute: 0,
	},
	endTime: {
		hour: 0,
		minute: 0,
	},
	inTimeMode: '',
};

export const individualSlice = createSlice({
	name: 'individual',
	initialState,
	reducers: {
		POST_IMAGE_SUCCESS: (state, action: PayloadAction<responseImageAPI>) => {},
		POST_IMAGE_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		cloneINDates: (
			state,
			action: PayloadAction<{
				confirmDatesTimetable: any;
				confirmClubs: Array<string>;
			}>
		) => {
			state.confirmClubs = action.payload.confirmClubs;
			state.confirmDatesTimetable = action.payload.confirmDatesTimetable;
			state.confirmDatesTimetable?.length &&
				state.confirmDatesTimetable.map((date, dIdx) => {
					state.weekIndex.map((day, idx) => {
						date[day].map((d) => {
							const startingMinute = Math.round(d.starting_minutes / 10);
							const endMinute = Math.round(d.end_minutes / 10);
							for (let i = d.starting_hours; i <= d.end_hours; i++) {
								if (i === d.starting_hours) {
									for (let j = startingMinute; j <= 6; j++) {
										state.individualDates[idx].times[i][j].color = date.color
											? date.color
											: Colors.grey400;
										state.individualDates[idx].times[i][j].isEveryTime = false;
										state.individualDates[idx].times[i][j].isPicked = true;
										state.individualDates[idx].times[i][j].mode = 'team';
										state.individualDates[idx].times[i][j].borderBottom = false;
										state.individualDates[idx].times[i][j].borderTop = false;
									}
								} else if (i === d.end_hours) {
									for (let j = 0; j < endMinute; j++) {
										state.individualDates[idx].times[i][j].color = date.color
											? date.color
											: Colors.grey400;
										state.individualDates[idx].times[i][j].isEveryTime = false;
										state.individualDates[idx].times[i][j].isPicked = true;
										state.individualDates[idx].times[i][j].mode = 'team';
										state.individualDates[idx].times[i][j].borderBottom = false;
										state.individualDates[idx].times[i][j].borderTop = false;
									}
								} else {
									for (let j = 0; j <= 6; j++) {
										state.individualDates[idx].times[i][j].color = date.color
											? date.color
											: Colors.grey400;
										state.individualDates[idx].times[i][j].isEveryTime = false;
										state.individualDates[idx].times[i][j].isPicked = true;
										state.individualDates[idx].times[i][j].mode = 'team';
										state.individualDates[idx].times[i][j].borderBottom = false;
										state.individualDates[idx].times[i][j].borderTop = false;
									}
								}
							}
						});
					});
				});
		},
		initialIndividualTimetable: (state) => {
			state.individualDates = defaultDatesWith60;
			makeHomeTimetable(state);
		},
		kakaoLogin: (state, action: PayloadAction<any>) => {
			if (state.cloneDateSuccess) {
				if (action.payload) {
					state.everyTime = action.payload;
					makeHomeTimetable(state);
				}
			}
		},
		LOGIN_EVERYTIME_SUCCESS: (state, action: PayloadAction<any>) => {
			state.everyTime = action.payload;
			state.loginSuccess = true;
			state.weekIndex.map(
				(day, idx) =>
					state.everyTime[day]?.length &&
					state.everyTime[day]?.map((d) => {
						const startingMinute = Math.round(d.starting_minutes / 10);
						const endMinute = Math.round(d.end_minutes / 10);

						for (let i = d.starting_hours; i <= d.end_hours; i++) {
							if (i === d.starting_hours) {
								for (let j = startingMinute; j <= 6; j++) {
									state.individualDates[idx].times[i][j].color = Colors.grey400;
									state.individualDates[idx].times[i][j].isEveryTime = true;
									state.individualDates[idx].times[i][j].isPicked = true;
									state.individualDates[idx].times[i][j].mode = 'start';
									state.individualDates[idx].times[i][j].borderTop = false;
									state.individualDates[idx].times[i][j].borderBottom = false;
								}
							} else if (i === d.end_hours) {
								for (let j = 0; j < endMinute; j++) {
									state.individualDates[idx].times[i][j].color = Colors.grey400;
									state.individualDates[idx].times[i][j].isEveryTime = true;
									state.individualDates[idx].times[i][j].isPicked = true;
									state.individualDates[idx].times[i][j].mode = 'start';
									state.individualDates[idx].times[i][j].borderTop = false;
									state.individualDates[idx].times[i][j].borderBottom = false;
								}
							} else {
								for (let j = 0; j <= 6; j++) {
									state.individualDates[idx].times[i][j].color = Colors.grey400;
									state.individualDates[idx].times[i][j].isEveryTime = true;
									state.individualDates[idx].times[i][j].isPicked = true;
									state.individualDates[idx].times[i][j].borderTop = false;
									state.individualDates[idx].times[i][j].borderBottom = false;
								}
							}
						}
					})
			);
		},
		LOGIN_EVERYTIME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		cloneIndividualDates: (state, action: PayloadAction<make_days[]>) => {
			state.cloneDateSuccess = true;
		},
		POST_EVERYTIME_SUCCESS: (state, action: PayloadAction<any>) => {
			state.loginSuccess = false;
		},
		POST_EVERYTIME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		setInStartTime: (
			state,
			action: PayloadAction<{ hour: number; min: number }>
		) => {
			const { hour, min } = action.payload;
			state.startTime.hour = hour;
			state.startTime.minute = min;
		},
		setInEndTime: (
			state,
			action: PayloadAction<{ hour: number; min: number }>
		) => {
			const { hour, min } = action.payload;
			state.endTime.hour = hour;
			state.endTime.minute = min;
		},
		checkInMode: (
			state,
			action: PayloadAction<{ time: number; idx: number }>
		) => {
			const { time, idx } = action.payload;
			state.inTimeMode = '';
			let modeSelect = [
				{
					count: 0,
					content: 'individual',
				},
				{
					count: 0,
					content: 'other',
				},
				{
					count: 0,
					content: 'everyTime',
				},
				{
					count: 0,
					content: 'normal',
				},
				{
					count: 0,
					content: 'team',
				},
			];
			state.individualDates[idx].times[time].forEach((t) => {
				modeSelect.forEach((mode) => mode.content === t.mode && mode.count++);
			});
			modeSelect.sort((a, b) => b.count - a.count);
			console.log(modeSelect);
			modeSelect.forEach((mode) => {
				if (mode.count) {
					state.inTimeMode += mode.content;
				}
			});
			console.log(state.inTimeMode);
		},
	},
	extraReducers: {},
});

export const {
	cloneIndividualDates,
	LOGIN_EVERYTIME_SUCCESS,
	kakaoLogin,
	cloneINDates,
	initialIndividualTimetable,
	setInEndTime,
	setInStartTime,
	checkInMode,
} = individualSlice.actions;

export default individualSlice.reducer;
