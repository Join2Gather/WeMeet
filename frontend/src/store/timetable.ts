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
import { makeGroupTimeTableWith60, makeIndividualTimetable } from '../lib/util';

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
	dates: defaultDatesWith60,
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
			state.dates = defaultDatesWith60;

			state.teamDatesWith60 = defaultDatesWith60;
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
						const startingMinute = Math.round(d.starting_minutes / 10) * 10;
						const endMinute = Math.round(d.end_minutes / 10) * 10;
						console.log(startingMinute, endMinute);
						for (let i = d.starting_hours; i <= d.end_hours; i++) {
							if (i === d.starting_hours) {
								for (let j = startingMinute / 10; j < 6; j++) {
									state.dates[idx].times[i][j].color = Colors.grey400;
									state.dates[idx].times[i][j].isEveryTime = false;
									state.dates[idx].times[i][j].isPicked = true;
									state.dates[idx].times[i][j].mode = 'start';
								}
							} else if (i === d.end_hours) {
								for (let j = 0; j <= endMinute / 10; j++) {
									state.dates[idx].times[i][j].color = Colors.grey400;
									state.dates[idx].times[i][j].isEveryTime = false;
									state.dates[idx].times[i][j].isPicked = true;
									state.dates[idx].times[i][j].mode = 'start';
								}
							} else {
								for (let j = 0; j <= 5; j++) {
									state.dates[idx].times[i][j].color = Colors.grey400;
									state.dates[idx].times[i][j].isEveryTime = false;
									state.dates[idx].times[i][j].isPicked = true;
								}
							}
						}
					})
				);
			}
		},
		GET_INDIVIDUAL_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		GET_GROUP_SUCCESS: (state, action: PayloadAction<any>) => {
			state.responseGroup = action.payload;
			// makeGroupTimetable(state);
			makeGroupTimeTableWith60(state);
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
			const startingMinute = Math.round(state.startMinute / 10);
			const endMinute = Math.round(state.endMinute / 10);
			// for (let i = state.startTime; i <= state.endTime; i++) {
			// 	if (
			// 		state.dates[state.dayIdx].times[state.startTime][i].color !==
			// 		Colors.white
			// 	) {
			// 		state.isTimePicked = true;
			// 		Alert.alert('이미 지정된 시간 입니다');
			// 		break;
			// 	}
			// }
			for (let i = state.startTime; i <= state.endTime; i++) {
				if (i === state.startTime) {
					for (let j = startingMinute; j < 6; j++) {
						state.dates[state.dayIdx].times[i][j].color = state.color;
						state.dates[state.dayIdx].times[i][j].isEveryTime = false;
						state.dates[state.dayIdx].times[i][j].isPicked = true;
						state.dates[state.dayIdx].times[i][j].mode = 'start';
					}
				} else if (i === state.endTime) {
					for (let j = 0; j <= endMinute; j++) {
						state.dates[state.dayIdx].times[i][j].color = state.color;
						state.dates[state.dayIdx].times[i][j].isEveryTime = false;
						state.dates[state.dayIdx].times[i][j].isPicked = true;
						state.dates[state.dayIdx].times[i][j].mode = 'start';
					}
				} else {
					for (let j = 0; j <= 5; j++) {
						state.dates[state.dayIdx].times[i][j].color = state.color;
						state.dates[state.dayIdx].times[i][j].isEveryTime = false;
						state.dates[state.dayIdx].times[i][j].isPicked = true;
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
	pushSelectEnd,
	pushSelectStart,
	changeAllColor,
	setDay,
	makePostIndividualDates,
	makeInitialTimetable,
	changeDayIdx,
	cloneEveryTime,
	getColor,
} = timetableSlice.actions;

export default timetableSlice.reducer;
