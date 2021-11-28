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
import { confirmDates } from '../interface/timetable';

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
const { defaultDatesWith60 } = useMakeTimeTableWith60(0, 23);

const initialState: timetable = {
	dates: [],
	teamDatesWith60: [],
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
	confirmDates: {
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
	confirmDatesPrepare: false,
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
	isTimeNotExist: false,
	color: '',
	peopleCount: 0,
	postConfirmSuccess: false,
	timeMode: 'normal',
	confirmClubs: [],
	confirmDatesTimetable: [],
	startHour: 0,
	endHour: 0,
	makeReady: false,
	timesText: [],
};

export const timetableSlice = createSlice({
	name: 'timetable',
	initialState,
	reducers: {
		makeInitialTimetable: (state) => {
			const { defaultDatesWith60, timesText } = useMakeTimeTableWith60(
				state.startHour,
				state.endHour
			);
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
			state.timesText = timesText;
			state.makeReady = false;
		},
		getOtherConfirmDates: (
			state,
			action: PayloadAction<{
				confirmDatesTimetable: any;
				confirmClubs: Array<string>;
			}>
		) => {
			state.confirmClubs = action.payload.confirmClubs;
			state.confirmDatesTimetable = action.payload.confirmDatesTimetable;
			state.confirmDatesTimetable.map((date, dIdx) => {
				state.weekIndex.map((day, idx) => {
					date[day].map((d) => {
						const startingMinute = Math.round(d.starting_minutes / 10);
						const endMinute = Math.round(d.end_minutes / 10);
						for (let i = d.starting_hours; i <= d.end_hours; i++) {
							if (i === d.starting_hours) {
								for (let j = startingMinute; j <= 6; j++) {
									state.dates[idx].times[i][j].color = date.color;
									state.dates[idx].times[i][j].isEveryTime = false;
									state.dates[idx].times[i][j].isPicked = true;
									state.dates[idx].times[i][j].mode = 'start';
									state.dates[idx].times[i][j].borderBottom = false;
									state.dates[idx].times[i][j].borderTop = false;
								}
							} else if (i === d.end_hours) {
								for (let j = 0; j < endMinute; j++) {
									state.dates[idx].times[i][j].color = date.color;
									state.dates[idx].times[i][j].isEveryTime = false;
									state.dates[idx].times[i][j].isPicked = true;
									state.dates[idx].times[i][j].mode = 'start';
									state.dates[idx].times[i][j].borderBottom = false;
									state.dates[idx].times[i][j].borderTop = false;
								}
							} else {
								for (let j = 0; j <= 6; j++) {
									state.dates[idx].times[i][j].color = date.color;
									state.dates[idx].times[i][j].isEveryTime = false;
									state.dates[idx].times[i][j].isPicked = true;
									state.dates[idx].times[i][j].borderBottom = false;
									state.dates[idx].times[i][j].borderTop = false;
								}
							}
						}
					});
				});
			});
		},
		GET_INDIVIDUAL_SUCCESS: (state, action: PayloadAction<any>) => {
			state.responseIndividual = {
				sun: [],
				mon: [],
				tue: [],
				wed: [],
				thu: [],
				fri: [],
				sat: [],
			};
			state.responseIndividual = action.payload;
			makeIndividualTimetable(state);
			if (state.everyTime) {
				state.weekIndex.map((day, idx) =>
					state.everyTime[day].map((d) => {
						const startingMinute = Math.round(d.starting_minutes / 10);
						const endMinute = Math.round(d.end_minutes / 10);
						for (let i = d.starting_hours; i <= d.end_hours; i++) {
							if (i === d.starting_hours) {
								for (let j = startingMinute; j <= 6; j++) {
									state.dates[idx].times[i][j].color = Colors.grey400;
									state.dates[idx].times[i][j].isEveryTime = false;
									state.dates[idx].times[i][j].isPicked = true;
									state.dates[idx].times[i][j].mode = 'start';
									state.dates[idx].times[i][j].borderTop = false;
									state.dates[idx].times[i][j].borderBottom = false;
								}
							} else if (i === d.end_hours) {
								for (let j = 0; j < endMinute; j++) {
									state.dates[idx].times[i][j].color = Colors.grey400;
									state.dates[idx].times[i][j].isEveryTime = false;
									state.dates[idx].times[i][j].isPicked = true;
									state.dates[idx].times[i][j].mode = 'start';
									state.dates[idx].times[i][j].borderTop = false;
									state.dates[idx].times[i][j].borderBottom = false;
								}
							} else {
								for (let j = 0; j <= 6; j++) {
									state.dates[idx].times[i][j].color = Colors.grey400;
									state.dates[idx].times[i][j].isEveryTime = false;
									state.dates[idx].times[i][j].isPicked = true;
									state.dates[idx].times[i][j].borderTop = false;
									state.dates[idx].times[i][j].borderBottom = false;
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
			state.confirmDatesPrepare = false;
			state.postConfirmSuccess = true;
		},
		postConfirmMakeFalse: (state) => {
			state.postConfirmSuccess = false;
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
		checkIsBlank: (state) => {
			for (let i = 0; i <= 6; i++) {
				if (
					state.dates[state.dayIdx].times[state.startTime][i].color !==
					Colors.white
				) {
					Alert.alert('알림', '이미 지정된 시간 입니다', [
						{
							text: '확인',
							onPress: () => {},
						},
					]);
					state.isTimePicked = true;
					return;
				}
			}
			// state.selectTime[state.day].push(action.payload);
		},
		checkIsExist: (state) => {
			let isNonColor = 0;
			for (let i = 0; i <= 6; i++) {
				if (
					state.teamDatesWith60[state.dayIdx].times[state.startTime][i]
						.color === Colors.white
				)
					isNonColor++;
			}
			if (isNonColor === 7) {
				Alert.alert('알림', '가능 시간 중에서 선택해 주세요', [
					{
						text: '확인',
						onPress: () => {},
					},
				]);
				state.isTimeNotExist = true;
			}
		},
		changeDayIdx: (state, action: PayloadAction<any>) => {
			state.dayIdx = action.payload;
		},
		changeConfirmTime: (state) => {
			const startingMinute = Math.round(state.startMinute / 10);
			const endMinute = Math.round(state.endMinute / 10);
			for (let i = state.startTime; i <= state.endTime; i++) {
				for (let j = 0; j <= 6; j++) {
					let isNonColor = 0;
					if (
						state.teamDatesWith60[state.dayIdx].times[i][j].color ===
						Colors.white
					) {
						isNonColor++;
					}
					if (isNonColor === 7) {
						Alert.alert('알림', '가능 시간 중에서 선택해 주세요', [
							{
								text: '확인',
								onPress: () => {},
							},
						]);
						state.isTimeNotExist = true;
						break;
					}
				}
			}

			if (!state.isTimeNotExist) {
				for (let i = state.startTime; i <= state.endTime; i++) {
					if (i === state.startTime) {
						for (let j = startingMinute; j <= 6; j++) {
							state.teamDatesWith60[state.dayIdx].times[i][j].color =
								state.color;
							state.teamDatesWith60[state.dayIdx].times[i][j].isEveryTime =
								false;
							state.teamDatesWith60[state.dayIdx].times[i][j].isPicked = true;
							state.teamDatesWith60[state.dayIdx].times[i][j].mode = 'start';
							state.teamDatesWith60[state.dayIdx].times[i][j].borderColor =
								state.color;
							state.teamDatesWith60[state.dayIdx].times[i][j].borderWidth = 1;
						}
					} else if (i === state.endTime) {
						for (let j = 0; j <= endMinute; j++) {
							state.teamDatesWith60[state.dayIdx].times[i][j].color =
								state.color;
							state.teamDatesWith60[state.dayIdx].times[i][j].isEveryTime =
								false;
							state.teamDatesWith60[state.dayIdx].times[i][j].isPicked = true;
							state.teamDatesWith60[state.dayIdx].times[i][j].mode = 'start';
							state.teamDatesWith60[state.dayIdx].times[i][j].borderColor =
								state.color;
							state.teamDatesWith60[state.dayIdx].times[i][j].borderWidth = 1;
						}
					} else {
						for (let j = 0; j <= 6; j++) {
							state.teamDatesWith60[state.dayIdx].times[i][j].color =
								state.color;
							state.teamDatesWith60[state.dayIdx].times[i][j].isEveryTime =
								false;
							state.teamDatesWith60[state.dayIdx].times[i][j].isPicked = true;
							state.teamDatesWith60[state.dayIdx].times[i][j].borderColor =
								state.color;
							state.teamDatesWith60[state.dayIdx].times[i][j].borderWidth = 1;
						}
					}
				}
			}
		},
		changeAllColor: (state) => {
			const startingMinute = Math.round(state.startMinute / 10);
			const endMinute = Math.round(state.endMinute / 10);

			for (let i = state.startTime; i <= state.endTime; i++) {
				for (let j = 0; j <= 6; j++) {
					if (state.dates[state.dayIdx].times[i][j].color !== Colors.white) {
						state.isTimePicked = true;
						Alert.alert('알림', '이미 지정된 시간 입니다', [
							{
								text: '확인',
								onPress: () => {},
							},
						]);
						break;
					}
				}
			}
			if (!state.isTimePicked) {
				for (let i = state.startTime; i <= state.endTime; i++) {
					if (i === state.startTime) {
						for (let j = startingMinute; j <= 6; j++) {
							state.dates[state.dayIdx].times[i][j].color = state.color;
							state.dates[state.dayIdx].times[i][j].isEveryTime = false;
							state.dates[state.dayIdx].times[i][j].isPicked = true;
							state.dates[state.dayIdx].times[i][j].mode = 'start';
							state.dates[state.dayIdx].times[i][j].borderBottom = false;
							state.dates[state.dayIdx].times[i][j].borderTop = false;
						}
					} else if (i === state.endTime) {
						for (let j = 0; j <= endMinute; j++) {
							state.dates[state.dayIdx].times[i][j].color = state.color;
							state.dates[state.dayIdx].times[i][j].isEveryTime = false;
							state.dates[state.dayIdx].times[i][j].isPicked = true;
							state.dates[state.dayIdx].times[i][j].mode = 'end';
							state.dates[state.dayIdx].times[i][j].borderBottom = false;
							state.dates[state.dayIdx].times[i][j].borderTop = false;
						}
					} else {
						for (let j = 0; j <= 6; j++) {
							state.dates[state.dayIdx].times[i][j].color = state.color;
							state.dates[state.dayIdx].times[i][j].isEveryTime = false;
							state.dates[state.dayIdx].times[i][j].isPicked = true;
							state.dates[state.dayIdx].times[i][j].borderBottom = false;
							state.dates[state.dayIdx].times[i][j].borderTop = false;
						}
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
		makeConfirmDates: (state) => {
			if (!state.isTimeNotExist) {
				state.confirmDates[state.weekIndex[state.dayIdx]].push({
					starting_hours: state.startTime,
					starting_minutes: state.startMinute,
					end_hours: state.endTime,
					end_minutes: state.endMinute,
				});
			}
			state.confirmDatesPrepare = true;
		},
		cloneEveryTime: (state, action: PayloadAction<any>) => {
			state.everyTime = action.payload;
		},
		getColor: (
			state,
			action: PayloadAction<{
				color: string;
				peopleCount: number;
				startHour: number;
				endHour: number;
			}>
		) => {
			state.color = action.payload.color;
			state.peopleCount = action.payload.peopleCount;
			state.startHour = action.payload.startHour;
			state.endHour = action.payload.endHour;
			state.makeReady = true;
			// if (state.color === '#FFFFFF' || '') {
			// 	state.color = Colors.blue500;
			// }
		},
		makeInitialTimePicked: (state) => {
			state.isTimePicked = false;
			state.isTimeNotExist = false;
		},
		setTimeMode: (state, action: PayloadAction<string>) => {
			state.timeMode = action.payload;
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
	checkIsBlank,
	changeAllColor,
	setDay,
	makePostIndividualDates,
	makeConfirmDates,
	makeInitialTimetable,
	changeDayIdx,
	cloneEveryTime,
	getColor,
	makeInitialTimePicked,
	checkIsExist,
	changeConfirmTime,
	postConfirmMakeFalse,
	setTimeMode,
	getOtherConfirmDates,
} = timetableSlice.actions;

export default timetableSlice.reducer;
