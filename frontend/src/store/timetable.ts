import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
	postConfirmAPI,
	postIndividualDatesAPI,
	requestGroupDatesAPI,
	requestIndividualDatesAPI,
	getSnapShotAPI,
	responseSnapShotTimetable,
	timetable,
	makeTeam,
} from '../interface';

import { createAction } from 'redux-actions';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/timetable';
import { takeLatest } from '@redux-saga/core/effects';
import { useMakeTimeTableWith60 } from '../hooks';
import { Alert } from 'react-native';
import {
	addEveryTime,
	deleteDate,
	makeConfirmWith,
	makeGroupTimeTableWith60,
	makeIndividualTimetable,
	makeSnapShotDate,
} from '../lib/util';
import _ from 'lodash';
const GET_INDIVIDUAL = 'timetable/GET_INDIVIDUAL';
const GET_GROUP = 'timetable/GET_GROUP';
const POST_INDIVIDUAL = 'timetable/POST_INDIVIDUAL';
const POST_CONFIRM = 'timetable/POST_CONFIRM';
const GET_SNAPSHOT = 'timetable/GET_SNAPSHOT';
const POST_SNAPSHOT = 'timetable/POST_SNAPSHOT';
const POST_REVERT = 'timetable/POST_REVERT';

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

export const postRevert = createAction(
	POST_REVERT,
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
const postRevertSaga = createRequestSaga(POST_REVERT, api.revertConfirm);

export function* timetableSaga() {
	yield takeLatest(GET_INDIVIDUAL, getIndividualSaga);
	yield takeLatest(GET_GROUP, getGroupSaga);
	yield takeLatest(POST_INDIVIDUAL, postIndividualSaga);
	yield takeLatest(POST_CONFIRM, postConfirmSaga);
	yield takeLatest(GET_SNAPSHOT, getSnapShotSaga);
	yield takeLatest(POST_CONFIRM, postSnapShotSaga);
	yield takeLatest(POST_REVERT, postRevertSaga);
}

const initialState: timetable = {
	teamURI: '',
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
	findTime: [],
	teamName: '',
	isInTeamTime: false,
	selectTimeMode: '',
	modalMode: false,
	isPostRevertSuccess: false,
	startTimeText: '',
	confirmCount: 1,
	alarmArray: [],
};

export const timetableSlice = createSlice({
	name: 'timetable',
	initialState,
	reducers: {
		makeInitialTimetable: (state) => {
			state.makeReady = false;
		},
		makeTeamTime: (state, action: PayloadAction<makeTeam>) => {
			const { color, endHour, startHour, peopleCount } = action.payload;
			state.startHour = startHour;
			state.endHour = endHour;
			state.peopleCount = peopleCount;
			state.color = color;
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
		makeInitialConfirmTime: (state) => {
			state.confirmDates = {
				sun: [],
				mon: [],
				tue: [],
				wed: [],
				thu: [],
				fri: [],
				sat: [],
			};
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
			state.alarmArray = [];
			action.payload.isGroup
				? makeConfirmWith(state, state.teamConfirmDate)
				: makeConfirmWith(state, state.dates);

			const find = state.confirmDatesTimetable.find(
				(team) => team.club.name === state.teamName
			);
			if (find) {
				state.weekIndex.forEach((dayOfWeek, idx) => {
					if (find[dayOfWeek].length) {
						let data = _.cloneDeep(find[dayOfWeek][0]);
						data['dayOfWeek'] = idx;
						state.alarmArray = [...state.alarmArray, data];
					}
				});
			}
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
			state.postIndividualDates = action.payload;
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
			console.log(action.payload);
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
		POST_REVERT_SUCCESS: (state, action: PayloadAction<any>) => {
			state.isPostRevertSuccess = true;
		},
		POST_REVERT_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
			state.isPostRevertSuccess = false;
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
			state.startTimeText = `${
				state.startTime > 12 ? state.startTime - 12 : state.startTime
			}시 ${action.payload}분`;
		},
		setEndMin: (state, action: PayloadAction<number>) => {
			state.endMinute = action.payload;
			state.isTimePicked = false; // 초기화
		},
		setDay: (state, action: PayloadAction<string>) => {
			state.day = action.payload;
		},
		checkIsBlank: (state, action: PayloadAction<string>) => {
			let isNonColor = 0;
			const mode = action.payload === 'start' ? state.startTime : state.endTime;

			state.dates[state.dayIdx].times[mode].forEach(
				(t) => t.mode === 'normal' && isNonColor++
			);

			if (isNonColor === 0) {
				Alert.alert('알림', '이미 지정된 시간 입니다', [
					{
						text: '확인',
						onPress: () => {},
					},
				]);
				state.isTimePicked = true;
			}

			// state.selectTime[state.day].push(action.payload);
		},
		toggleTimePick: (state) => {
			state.isTimePicked = false;
		},
		checkIsExist: (state, action: PayloadAction<string>) => {
			let isNonColor = 0;
			const mode = action.payload === 'start' ? state.startTime : state.endTime;
			if (state.endMinute !== 0) {
				state.teamConfirmDate[state.dayIdx].times[mode].forEach((t) => {
					t.mode === 'normal' && isNonColor++;
				});

				if (isNonColor === 7) {
					Alert.alert('알림', '가능 시간 중에서 선택해 주세요', [
						{
							text: '확인',
							onPress: () => {},
						},
					]);
					state.isTimeNotExist = true;
				}
			}
		},
		checkMode: (
			state,
			action: PayloadAction<{ time: number; mode: string }>
		) => {
			const { time, mode } = action.payload;
			state.selectTimeMode = '';
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
			if (mode === 'group') {
				state.teamDatesWith60[state.dayIdx].times[time].forEach((t) => {
					modeSelect.forEach((mode) => mode.content === t.mode && mode.count++);
				});
			} else {
				state.dates[state.dayIdx].times[time].forEach((t) => {
					modeSelect.forEach((mode) => mode.content === t.mode && mode.count++);
				});
			}

			modeSelect.sort((a, b) => b.count - a.count);

			modeSelect.forEach((mode) => {
				if (mode.count) {
					state.selectTimeMode += mode.content;
				}
			});
			console.log(state.selectTimeMode);
		},
		changeDayIdx: (state, action: PayloadAction<any>) => {
			state.dayIdx = action.payload;
		},
		changeConfirmTime: (state) => {
			const startingMinute = Math.round(state.startMinute / 10);
			const endMinute = Math.round(state.endMinute / 10);
			const dayIdx = state.dayIdx;

			if (!state.isTimeNotExist) {
				for (let i = state.startTime; i <= state.endTime; i++) {
					if (i === state.startTime) {
						for (let j = startingMinute; j <= 6; j++) {
							if (j === startingMinute) {
								state.teamConfirmDate[dayIdx].times[i][j].borderTop = true;
							}
							state.teamConfirmDate[dayIdx].times[i][j].color = state.color;
							state.teamConfirmDate[dayIdx].times[i][j].mode = 'confirm';
							state.teamConfirmDate[dayIdx].times[i][j].borderWidth = 2;
						}
					} else if (i === state.endTime) {
						for (let j = 0; j <= endMinute; j++) {
							if (j === endMinute) {
								state.teamConfirmDate[dayIdx].times[i][j].borderBottom = true;
							}
							state.teamConfirmDate[dayIdx].times[i][j].color = state.color;
							state.teamConfirmDate[dayIdx].times[i][j].mode = 'confirm';
							state.teamConfirmDate[dayIdx].times[i][j].borderWidth = 2;
						}
					} else {
						for (let j = 0; j <= 6; j++) {
							state.teamConfirmDate[dayIdx].times[i][j].color = state.color;
							state.teamConfirmDate[dayIdx].times[i][j].mode = 'confirm';
							state.teamConfirmDate[dayIdx].times[i][j].borderWidth = 2;
						}
					}
				}
			}
		},

		makePostIndividualDates: (state) => {
			if (!state.isTimePicked) {
				const data = {
					starting_hours: state.startTime,
					starting_minutes: state.startMinute,
					end_hours: state.endTime,
					end_minutes: state.endMinute,
				};
				state.postIndividualDates[state.weekIndex[state.dayIdx]] = [
					...state.postIndividualDates[state.weekIndex[state.dayIdx]],
					data,
				];
				state.postDatesPrepare = true;
			}
		},
		deletePostTime: (state) => {
			const startMinute = Math.round(state.findTime[0].startTime.minute / 10);
			const endMinute = Math.round(state.findTime[0].endTime.minute / 10);
			const startHour = state.findTime[0].startTime.hour;
			const endHour = state.findTime[0].endTime.hour;
			state.postIndividualDates[state.weekIndex[state.dayIdx]] =
				state.postIndividualDates[state.weekIndex[state.dayIdx]].filter(
					(day: any) => day.starting_hours !== startHour
				);
			const dayIdx = state.dayIdx;

			deleteDate(
				state,
				state.dates,
				startHour,
				startMinute,
				endHour,
				endMinute,
				dayIdx
			);
			deleteDate(
				state,
				state.teamDatesWith60,
				startHour,
				startMinute,
				endHour,
				endMinute,
				dayIdx
			);
			deleteDate(
				state,
				state.teamConfirmDate,
				startHour,
				startMinute,
				endHour,
				endMinute,
				dayIdx
			);
			state.postDatesPrepare = true;
		},
		makeConfirmDates: (state) => {
			if (!state.isTimeNotExist) {
				const data = {
					starting_hours: state.startTime,
					starting_minutes: state.startMinute,
					end_hours: state.endTime,
					end_minutes: state.endMinute,
				};

				state.confirmDates[state.weekIndex[state.dayIdx]].push(data);
			}
		},
		makeConfirmPrepare: (state) => {
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
			action: PayloadAction<{ day: string; time: number; isTeam: boolean }>
		) => {
			const day = action.payload.day;
			const time = action.payload.time;
			state.findTime = [];
			if (action.payload.isTeam) {
				state.responseGroup[day].avail_time.forEach((t, idx) => {
					if (t.starting_hours <= time && t.end_hours >= time) {
						const data = {
							people:
								state.responseGroup[day].avail_people[idx].length !== 1
									? state.responseGroup[day].avail_people[idx].join(', ')
									: state.responseGroup[day].avail_people[idx],

							startTime: {
								hour: t.starting_hours,
								minute: t.starting_minutes,
							},
							endTime: {
								hour: t.end_hours,
								minute: t.end_minutes,
							},
							selectTime: time,
							timeText: `${
								t.starting_hours > 12
									? `오후  ${t.starting_hours - 12}`
									: `오전  ${t.starting_hours}`
							} : ${
								t.starting_minutes < 10
									? '0' + t.starting_minutes
									: t.starting_minutes
							}  ~  ${
								t.end_hours > 12
									? `오후  ${t.end_hours - 12}`
									: `오전  ${t.end_hours}`
							} : ${t.end_minutes < 10 ? '0' + t.end_minutes : t.end_minutes}`,
						};

						// data.people.forEach((p:any) => {
						// 	p.
						// })
						console.log(
							data.people,
							state.responseGroup[day].avail_people[idx].length
						);
						state.findTime = [...state.findTime, data];
					}
				});
			} else {
				state.responseIndividual[day].forEach((t) => {
					if (t.starting_hours <= time && t.end_hours >= time) {
						const data = {
							startTime: {
								hour: t.starting_hours,
								minute: t.starting_minutes,
							},
							endTime: {
								hour: t.end_hours,
								minute: t.end_minutes,
							},
							selectTime: time,
							timeText: `${
								t.starting_hours > 12
									? `오후  ${t.starting_hours - 12}`
									: `오전  ${t.starting_hours}`
							} : ${
								t.starting_minutes < 10
									? '0' + t.starting_minutes
									: t.starting_minutes
							}  ~  ${
								t.end_hours > 12
									? `오후  ${t.end_hours - 12}`
									: `오전  ${t.end_hours}`
							} : ${t.end_minutes < 10 ? '0' + t.end_minutes : t.end_minutes}`,
						};
						state.findTime = [...state.findTime, data];
					}
				});
			}
		},
		setTeamName: (
			state,
			action: PayloadAction<{ name: string; uri: string }>
		) => {
			const { name, uri } = action.payload;
			state.teamName = name;
			state.teamURI = uri;
		},
		setIsInTeamTime: (state, action: PayloadAction<boolean>) => {
			state.isInTeamTime = action.payload;
		},
		setTimeModalMode: (state, action: PayloadAction<boolean>) => {
			state.modalMode = action.payload;
		},
		setConfirmCount: (state, action: PayloadAction<number>) => {
			state.confirmCount = action.payload;
		},

		// checkTimeMode(state, action:PayloadAction<)
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
	toggleTimePick,
	setConfirmCount,
	setDay,
	makePostIndividualDates,
	makeConfirmDates,
	makeConfirmPrepare,
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
	setTeamName,
	makeInitialConfirmTime,
	deletePostTime,
	setIsInTeamTime,
	checkMode,
	setTimeModalMode,
} = timetableSlice.actions;

export default timetableSlice.reducer;
