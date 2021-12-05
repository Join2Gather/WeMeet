import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
	changeColorType,
	postConfirmAPI,
	postIndividualDatesAPI,
	requestGroupDatesAPI,
	requestIndividualDatesAPI,
	getSnapShotAPI,
	responseSnapShotTimetable,
	timetable,
	makeTeam,
} from '../interface';
import { Colors } from 'react-native-paper';
import { createAction } from 'redux-actions';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/timetable';
import { takeLatest } from '@redux-saga/core/effects';
import { useMakeTimetable, useMakeTimeTableWith60 } from '../hooks';
import { Alert } from 'react-native';
import {
	addEveryTime,
	makeConfirmWith,
	makeGroupTimeTableWith60,
	makeIndividualTimetable,
	makeSnapShotDate,
} from '../lib/util';
import { confirmDates } from '../interface/timetable';

const GET_INDIVIDUAL = 'timetable/GET_INDIVIDUAL';
const GET_GROUP = 'timetable/GET_GROUP';
const POST_INDIVIDUAL = 'timetable/POST_INDIVIDUAL';
const POST_CONFIRM = 'timetable/POST_CONFIRM';
const GET_SNAPSHOT = 'timetable/GET_SNAPSHOT';
const POST_SNAPSHOT = 'timetable/POST_SNAPSHOT';

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
export const getSnapShot = createAction(
	GET_SNAPSHOT,
	(data: getSnapShotAPI) => data
);
export const postSnapShot = createAction(
	POST_SNAPSHOT,
	(data: getSnapShotAPI) => data
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
const getSnapShotSaga = createRequestSaga(GET_SNAPSHOT, api.getSnapShot);
const postSnapShotSaga = createRequestSaga(POST_SNAPSHOT, api.confirmSnapShot);

export function* timetableSaga() {
	yield takeLatest(GET_INDIVIDUAL, getIndividualSaga);
	yield takeLatest(GET_GROUP, getGroupSaga);
	yield takeLatest(POST_INDIVIDUAL, postIndividualSaga);
	yield takeLatest(POST_CONFIRM, postConfirmSaga);
	yield takeLatest(GET_SNAPSHOT, getSnapShotSaga);
	yield takeLatest(POST_CONFIRM, postSnapShotSaga);
}

const initialState: timetable = {
	dates: [],
	teamDatesWith60: [],
	snapShotDate: [],
	teamConfirmDate: [],
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
	snapShotError: false,
	createdDate: '',
	reload: false,
	finTime: [],
};

export const timetableSlice = createSlice({
	name: 'timetable',
	initialState,
	reducers: {
		makeInitialTimetable: (state) => {
			state.makeReady = false;
		},
		makeTeamTime: (state, action: PayloadAction<makeTeam>) => {
			state.startHour = action.payload.startHour;
			state.endHour = action.payload.endHour;
			state.peopleCount = action.payload.peopleCount;
			state.color = action.payload.color;
			const { defaultDatesWith60, timesText } = useMakeTimeTableWith60(
				action.payload.startHour,
				action.payload.endHour
			);
			// 시간표 생성
			state.dates = defaultDatesWith60;
			state.teamDatesWith60 = defaultDatesWith60;
			state.snapShotDate = defaultDatesWith60;
			state.teamConfirmDate = defaultDatesWith60;
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
			state.makeReady = true;
		},
		getOtherConfirmDates: (
			state,
			action: PayloadAction<{
				confirmDatesTimetable: any;
				confirmClubs: Array<string>;
				isGroup: boolean;
			}>
		) => {
			state.confirmClubs = action.payload.confirmClubs;
			state.confirmDatesTimetable = action.payload.confirmDatesTimetable;
			action.payload.isGroup
				? makeConfirmWith(state, state.teamConfirmDate)
				: makeConfirmWith(state, state.dates);
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
			addEveryTime(state, state.dates);
			state.reload = false;
		},
		GET_INDIVIDUAL_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		GET_GROUP_SUCCESS: (state, action: PayloadAction<any>) => {
			state.responseGroup = action.payload;
			makeGroupTimeTableWith60(state, state.teamDatesWith60);
			makeGroupTimeTableWith60(state, state.teamConfirmDate);
			addEveryTime(state, state.teamConfirmDate);
		},
		GET_GROUP_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		POST_INDIVIDUAL_SUCCESS: (state, action: PayloadAction<any>) => {
			state.responseIndividual = action.payload;
			// state.loginSuccess = true;
			state.postDatesPrepare = false;
			state.reload = true;
		},
		POST_INDIVIDUAL_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		POST_CONFIRM_SUCCESS: (state, action: PayloadAction<any>) => {
			state.confirmDatesPrepare = false;
			state.postConfirmSuccess = true;
		},
		GET_SNAPSHOT_SUCCESS: (
			state,
			action: PayloadAction<responseSnapShotTimetable>
		) => {
			const { created_date, dates } = action.payload;
			state.snapShotError = false;
			makeSnapShotDate(state, created_date, dates);
		},
		GET_SNAPSHOT_FAILURE: (state, action: PayloadAction<any>) => {
			state.snapShotError = true;
		},
		POST_SNAPSHOT_SUCCESS: (state, action: PayloadAction<any>) => {
			console.log(action.payload);
		},
		POST_SNAPSHOT_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
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
						Alert.alert(
							'알림',
							'선택 가능 시간 중에서 확정 시간을 선택해 주세요',
							[
								{
									text: '확인',
									onPress: () => {},
								},
							]
						);
						state.isTimeNotExist = true;
						break;
					}
				}
			}

			// if (!state.isTimeNotExist) {
			// 	for (let i = state.startTime; i <= state.endTime; i++) {
			// 		if (i === state.startTime) {
			// 			for (let j = startingMinute; j <= 6; j++) {
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].color =
			// 					state.color;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].isEveryTime =
			// 					false;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].isPicked = true;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].mode = 'start';
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].borderColor =
			// 					state.color;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].borderWidth = 1;
			// 			}
			// 		} else if (i === state.endTime) {
			// 			for (let j = 0; j <= endMinute; j++) {
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].color =
			// 					state.color;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].isEveryTime =
			// 					false;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].isPicked = true;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].mode = 'start';
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].borderColor =
			// 					state.color;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].borderWidth = 1;
			// 			}
			// 		} else {
			// 			for (let j = 0; j <= 6; j++) {
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].color =
			// 					state.color;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].isEveryTime =
			// 					false;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].isPicked = true;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].borderColor =
			// 					state.color;
			// 				state.teamDatesWith60[state.dayIdx].times[i][j].borderWidth = 1;
			// 			}
			// 		}
			// 	}
			// }
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
			// if (!state.isTimePicked) {
			// 	for (let i = state.startTime; i <= state.endTime; i++) {
			// 		if (i === state.startTime) {
			// 			for (let j = startingMinute; j <= 6; j++) {
			// 				state.dates[state.dayIdx].times[i][j].color = state.color;
			// 				state.dates[state.dayIdx].times[i][j].isEveryTime = false;
			// 				state.dates[state.dayIdx].times[i][j].isPicked = true;
			// 				state.dates[state.dayIdx].times[i][j].mode = 'start';
			// 				state.dates[state.dayIdx].times[i][j].borderBottom = false;
			// 				state.dates[state.dayIdx].times[i][j].borderTop = false;
			// 			}
			// 		} else if (i === state.endTime) {
			// 			for (let j = 0; j <= endMinute; j++) {
			// 				state.dates[state.dayIdx].times[i][j].color = state.color;
			// 				state.dates[state.dayIdx].times[i][j].isEveryTime = false;
			// 				state.dates[state.dayIdx].times[i][j].isPicked = true;
			// 				state.dates[state.dayIdx].times[i][j].mode = 'end';
			// 				state.dates[state.dayIdx].times[i][j].borderBottom = false;
			// 				state.dates[state.dayIdx].times[i][j].borderTop = false;
			// 			}
			// 		} else {
			// 			for (let j = 0; j <= 6; j++) {
			// 				state.dates[state.dayIdx].times[i][j].color = state.color;
			// 				state.dates[state.dayIdx].times[i][j].isEveryTime = false;
			// 				state.dates[state.dayIdx].times[i][j].isPicked = true;
			// 				state.dates[state.dayIdx].times[i][j].borderBottom = false;
			// 				state.dates[state.dayIdx].times[i][j].borderTop = false;
			// 			}
			// 		}
			// 	}
			// }
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

		makeInitialTimePicked: (state) => {
			state.isTimePicked = false;
			state.isTimeNotExist = false;
		},
		setTimeMode: (state, action: PayloadAction<string>) => {
			state.timeMode = action.payload;
		},
		changeTimetableColor: (state, action: PayloadAction<string>) => {
			state.color = action.payload;
		},
		findTimeFromResponse: (
			state,
			action: PayloadAction<{ day: string; time: number }>
		) => {
			const day = action.payload.day;
			const time = action.payload.time;
			state.finTime = [];

			state.responseGroup[day].avail_time.forEach((t, idx) => {
				if (t.starting_hours <= time && t.end_hours >= time) {
					const data = {
						people: state.responseGroup[day].avail_people[idx],
						startTime: {
							hour: t.starting_hours,
							minute: t.starting_minutes,
						},
						endTime: {
							hour: t.end_hours,
							minute: t.end_minutes,
						},
						selectTime: time,
					};
					state.finTime.push(data);
				}
			});
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
	makeInitialTimePicked,
	checkIsExist,
	changeConfirmTime,
	postConfirmMakeFalse,
	setTimeMode,
	getOtherConfirmDates,
	makeTeamTime,
	changeTimetableColor,
	findTimeFromResponse,
} = timetableSlice.actions;

export default timetableSlice.reducer;
