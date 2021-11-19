import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
	changeColorType,
	postConfirmAPI,
	postIndividualDatesAPI,
	requestGroupDatesAPI,
	requestIndividualDatesAPI,
	timetable,
} from '../interface';
import { Colors } from 'react-native-paper';
import { createAction } from 'redux-actions';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/timetable';
import { takeLatest } from '@redux-saga/core/effects';
import { useMakeTimetable, useMakeTimeTableWith60 } from '../hooks';
import { Alert } from 'react-native';
import { makeGroupTimetable, makeIndividualTimetable } from '../lib/util';

const GET_INDIVIDUAL = 'timetable/GET_INDIVIDUAL';
const GET_GROUP = 'timetable/GET_GROUP';
const POST_INDIVIDUAL = 'timetable/POST_INDIVIDUAL';
const POST_CONFIRM = 'timetable/POST_CONFIRM';

export const getIndividualDates = createAction(
	GET_INDIVIDUAL,
	(data: requestIndividualDatesAPI) => data
);
export const getGroupDates = createAction(
	GET_GROUP,
	(data: requestGroupDatesAPI) => data
);
export const postIndividualTime = createAction(
	POST_INDIVIDUAL,
	(data: postIndividualDatesAPI) => data
);

export const postConfirm = createAction(
	POST_CONFIRM,
	(data: postConfirmAPI) => data
);

const getIndividualSaga = createRequestSaga(
	GET_INDIVIDUAL,
	api.getIndividualDates
);
const getGroupSaga = createRequestSaga(GET_GROUP, api.getGroupDates);
const postIndividualSaga = createRequestSaga(
	POST_INDIVIDUAL,
	api.postIndividualTime
);
const postConfirmSaga = createRequestSaga(POST_CONFIRM, api.postConfirm);

export function* timetableSaga() {
	yield takeLatest(GET_INDIVIDUAL, getIndividualSaga);
	yield takeLatest(GET_GROUP, getGroupSaga);
	yield takeLatest(POST_INDIVIDUAL, postIndividualSaga);
	yield takeLatest(POST_CONFIRM, postConfirmSaga);
}

const { defaultDates } = useMakeTimetable();
const { defaultDatesWith60 } = useMakeTimeTableWith60();

const initialState: timetable = {
	dates: defaultDates,
	teamDates: defaultDates,
	teamDatesWith60: defaultDatesWith60,
	startTime: 0.0,
	endTime: 0.0,
	selectTime: {
		sun: [],
		mon: [],
		tue: [],
		thu: [],
		wed: [],
		fri: [],
		sat: [],
	},
	day: '',
	dayIdx: 0,
	startMinute: 0,
	endMinute: 0,
	weekIndex: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
	postIndividualDates: {
		sun: [],
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: [],
	},
	error: '',
	postDatesPrepare: false,
	responseIndividual: {
		sun: [],
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: [],
	},
	responseGroup: {
		sun: {
			avail_people: [],
			avail_time: [],
			count: [],
		},
		mon: {
			avail_people: [],
			avail_time: [],
			count: [],
		},
		tue: {
			avail_people: [],
			avail_time: [],
			count: [],
		},
		wed: {
			avail_people: [],
			avail_time: [],
			count: [],
		},
		thu: {
			avail_people: [],
			avail_time: [],
			count: [],
		},
		fri: {
			avail_people: [],
			avail_time: [],
			count: [],
		},
		sat: {
			avail_people: [],
			avail_time: [],
			count: [],
		},
	},
	everyTime: {
		sun: [],
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: [],
	},
	isTimePicked: false,
	color: '',
	peopleCount: 0,
};

export const timetableSlice = createSlice({
	name: 'timetable',
	initialState,
	reducers: {
		makeInitialTimetable: (state) => {
			state.dates = defaultDates;
			state.teamDates = defaultDates;
			state.postIndividualDates = {
				sun: [],
				mon: [],
				tue: [],
				wed: [],
				thu: [],
				fri: [],
				sat: [],
			};
		},

		GET_INDIVIDUAL_SUCCESS: (state, action: PayloadAction<any>) => {
			state.responseIndividual = action.payload;
			makeIndividualTimetable(state);
			if (state.everyTime) {
				state.weekIndex.map((day, idx) =>
					state.everyTime[day].map((d) => {
						state.dates[idx].times.map((inDay) => {
							if (d.starting_hours === inDay.time) {
								for (let i = d.starting_hours - 8; i <= d.end_hours - 8; i++) {
									if (i + 8 == d.starting_hours) {
										state.dates[idx].times[i].color = Colors.grey400;
										state.dates[idx].times[i].isPicked = true;
										state.dates[idx].times[i].startPercent =
											(1 - d.starting_minutes / 60) * 100;
										state.dates[idx].times[i].mode = 'start';
									} else if (i + 8 == d.end_hours) {
										state.dates[idx].times[i].color = Colors.grey400;
										state.dates[idx].times[i].isPicked = true;
										state.dates[idx].times[i].endPercent =
											(d.end_minutes / 60) * 100;
										state.dates[idx].times[i].mode = 'end';
									} else {
										state.dates[idx].times[i].color = Colors.grey400;
										state.dates[idx].times[i].isPicked = true;
										state.dates[idx].times[i].isFullTime = true;
									}
								}
							}
						});
					})
				);
			}
		},
		GET_INDIVIDUAL_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		GET_GROUP_SUCCESS: (state, action: PayloadAction<any>) => {
			state.responseGroup = action.payload;
			makeGroupTimetable(state);
		},
		GET_GROUP_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		POST_INDIVIDUAL_SUCCESS: (state, action: PayloadAction<any>) => {
			state.responseIndividual = action.payload;
			// state.loginSuccess = true;
			state.postDatesPrepare = false;
		},
		POST_INDIVIDUAL_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		POST_CONFIRM_SUCCESS: (state, action: PayloadAction<any>) => {
			console.log(action.payload);
		},
		POST_CONFIRM_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		cloneDates: (state, action: PayloadAction<any>) => {
			state.dates = action.payload;
			state.teamDates = action.payload;
		},
		setStartHour: (state, action: PayloadAction<number>) => {
			state.startTime = action.payload;
		},
		setEndHour: (state, action: PayloadAction<number>) => {
			state.endTime = action.payload;
		},
		setStartMin: (state, action: PayloadAction<number>) => {
			state.startMinute = action.payload;
		},
		setStartPercentage: (state) => {
			const find = state.dates[state.dayIdx].times.find(
				(d) => d.time === state.startTime
			);
			if (find) {
				find.color = state.color;
				find.isPicked = true;
				find.startPercent = (1 - state.startMinute / 60) * 100;
				find.mode = 'start';
			}
		},
		removeStartPercentage: (state) => {
			const find = state.dates[state.dayIdx].times.find(
				(d) => d.time === state.startTime
			);
			if (find) {
				find.color = Colors.white;
				find.isPicked = false;
				find.startPercent = 0;
				find.mode = 'normal';
			}
		},
		setEndMin: (state, action: PayloadAction<number>) => {
			state.endMinute = action.payload;
			state.isTimePicked = false; // 초기화
		},
		setDay: (state, action: PayloadAction<string>) => {
			state.day = action.payload;
		},
		pushSelectStart: (state, action: PayloadAction<number>) => {
			state.selectTime[state.day].push(action.payload);
		},
		pushSelectEnd: (state) => {
			for (
				let i = Math.floor(state.startTime) + 1;
				i < Math.floor(state.endTime);
				i++
			) {
				state.selectTime[state.day] && state.selectTime[state.day].push(i);
			}
		},
		changeDayIdx: (state, action: PayloadAction<any>) => {
			state.dayIdx = action.payload;
		},
		changeAllColor: (state) => {
			for (
				let i = Math.floor(state.startTime);
				i <= Math.floor(state.endTime);
				i++
			) {
				if (state.dates[state.dayIdx].times[i - 8].color !== Colors.white) {
					state.isTimePicked = true;
					Alert.alert('이미 지정된 시간 입니다');
					break;
				}
			}
			for (
				let i = Math.floor(state.startTime);
				i <= Math.floor(state.endTime);
				i++
			) {
				if (state.isTimePicked) {
					break;
				} else {
					state.dates[state.dayIdx].times[i - 8].color = state.color;
					state.dates[state.dayIdx].times[i - 8].isFullTime = true;
					if (i === Math.floor(state.endTime)) {
						state.dates[state.dayIdx].times[i - 8].isPicked = true;
						state.dates[state.dayIdx].times[i - 8].endPercent =
							(state.endMinute / 60) * 100;
						state.dates[state.dayIdx].times[i - 8].mode = 'end';
						state.dates[state.dayIdx].times[i - 8].isFullTime = false;
					} else if (i === Math.floor(state.startTime)) {
						state.dates[state.dayIdx].times[i - 8].color = state.color;
						state.dates[state.dayIdx].times[i - 8].isPicked = true;
						state.dates[state.dayIdx].times[i - 8].startPercent =
							(1 - state.startMinute / 60) * 100;
						state.dates[state.dayIdx].times[i - 8].mode = 'start';
					}
				}
			}
		},
		makePostIndividualDates: (state) => {
			if (!state.isTimePicked) {
				state.postIndividualDates[state.weekIndex[state.dayIdx]].push({
					starting_hours: state.startTime,
					starting_minutes: state.startMinute,
					end_hours: state.endTime,
					end_minutes: state.endMinute,
				});
				state.postDatesPrepare = true;
			}
		},
		cloneEveryTime: (state, action: PayloadAction<any>) => {
			state.everyTime = action.payload;
		},
		getColor: (
			state,
			action: PayloadAction<{ color: string; peopleCount: number }>
		) => {
			state.color = action.payload.color;
			state.peopleCount = action.payload.peopleCount;
			if (state.color === '#FFFFFF' || '') {
				state.color = Colors.blue500;
			}
		},
	},
	extraReducers: {},
});

export const {
	cloneDates,
	setStartHour,
	setEndHour,
	setStartMin,
	setEndMin,
	// changeColor,
	pushSelectEnd,
	pushSelectStart,
	changeAllColor,
	setDay,
	// setStartPercentage,
	removeStartPercentage,
	makePostIndividualDates,
	makeInitialTimetable,
	changeDayIdx,
	cloneEveryTime,
	getColor,
} = timetableSlice.actions;

export default timetableSlice.reducer;
