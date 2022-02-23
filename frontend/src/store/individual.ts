import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/individual';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type {
	postImageAPI,
	Individual,
	responseImageAPI,
	make_days,
	postEveryTimeAPI,
	findTime,
	homeTime
} from '../interface';
import { Colors } from 'react-native-paper';
import { useMakeTimeTableWith60 } from '../hooks';
import { makeHomeTimetable, makeTime } from '../lib/util';
import { Alert } from 'react-native';
import { individualInitialState } from '../lib/util/individualReducerHelper';

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

const initialState: Individual = individualInitialState;

export const individualSlice = createSlice({
	name: 'individual',
	initialState,
	reducers: {
		cloneINDates: (
			state,
			action: PayloadAction<{
				confirmDatesTimetable: any;
				confirmClubs: Array<string>;
				inTimeColor: string;
			}>
		) => {
			const { confirmClubs, confirmDatesTimetable } = action.payload;
			state.confirmClubs = confirmClubs;
			state.confirmDatesTimetable = confirmDatesTimetable;
			state.inTimeColor = action.payload.inTimeColor;
			state.individualCount = 0;
			state.groupCount = 0;
			state.confirmDatesTimetable?.length &&
				state.confirmDatesTimetable.map((date, dIdx) => {
					state.weekIndex.map((day, idx) => {
						date[day].map((d: any) => {
							const startingMinute = Math.round(d.starting_minutes / 10);
							const endMinute = Math.round(d.end_minutes / 10);
							if (state.todayDate === idx) {
								if (date.club === null) {
									state.individualCount = date[day].length;
								} else {
									state.groupCount = date[day].length;
								}
							}
							for (let i = d.starting_hours; i <= d.end_hours; i++) {
								if (d.starting_hours === d.end_hours) {
									for (let j = startingMinute; j < endMinute; j++) {
										if (state.individualDates[idx].times[i])
											makeTime(
												state.individualDates[idx].times[i][j],
												date.color ? 'team' : 'everyTime',
												date.color ? date.color : state.inTimeColor
											);
									}
								} else {
									if (i === d.starting_hours) {
										for (let j = startingMinute; j <= 5; j++) {
											if (state.individualDates[idx].times[i]) {
												if (j === 0) {
													state.individualDates[idx].times[i][j].color =
														date.color ? date.color : state.inTimeColor;
													state.individualDates[idx].times[i][j].mode =
														date.color ? 'team' : 'everyTime';
													state.individualDates[idx].times[i][
														j
													].borderWidth = 0.3;
												} else
													makeTime(
														state.individualDates[idx].times[i][j],
														date.color ? 'team' : 'everyTime',
														date.color ? date.color : state.inTimeColor
													);
											}
										}
									} else if (i === d.end_hours) {
										for (let j = 0; j < endMinute; j++) {
											if (state.individualDates[idx].times[i]) {
												makeTime(
													state.individualDates[idx].times[i][j],
													date.color ? 'team' : 'everyTime',
													date.color ? date.color : state.inTimeColor
												);
											}
										}
									} else {
										if (state.individualDates[idx].times[i])
											state.individualDates[idx].timeBackColor[i] = date.color
												? date.color
												: state.inTimeColor;
										for (let j = 0; j <= 5; j++) {
											if (state.individualDates[idx].times[i]) {
												makeTime(
													state.individualDates[idx].times[i][j],
													date.color ? 'team' : 'everyTime',
													date.color ? date.color : state.inTimeColor
												);
											}
										}
									}
								}
							}
						});
					});
				});
		},
		initialIndividualTimetable: (state) => {
			const { defaultDatesWith60, timesText } = useMakeTimeTableWith60(
				state.homeTime.start,
				state.homeTime.end
			);
			state.individualDates = defaultDatesWith60;
			state.individualTimesText = timesText;
		},
		makeHomeTime: (state) => {
			makeHomeTimetable(state);
			state.postHomeSuccess = false;
		},
		setEveryTimeData: (state, action: PayloadAction<any>) => {
			state.everyTime = action.payload;
			delete state.everyTime['club'];
			delete state.everyTime['is_temporary_reserved'];
		},

		cloneHomeDate: (state, action: PayloadAction<homeTime>) => {
			const { start, end } = action.payload;
			state.homeTime.start = start;
			state.homeTime.end = end;
			const { defaultDatesWith60, timesText } = useMakeTimeTableWith60(
				start,
				end
			);
			state.individualDates = defaultDatesWith60;
			state.individualTimesText = timesText;
		},
		kakaoLogin: (state, action: PayloadAction<any>) => {
			if (state.cloneDateSuccess) {
				if (action.payload) {
					(state.everyTime = {
						sun: [],
						mon: [],
						tue: [],
						wed: [],
						thu: [],
						fri: [],
						sat: []
					}),
						(state.everyTime = action.payload);
					delete state.everyTime['club'];
					delete state.everyTime['is_temporary_reserved'];
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
							if (d.starting_hours === d.end_hours) {
								for (let j = startingMinute; j < endMinute; j++) {
									if (state.individualDates[idx].times[i])
										makeTime(
											state.individualDates[idx].times[i][j],
											'team',
											state.inTimeColor
										);
								}
							} else {
								if (i === d.starting_hours) {
									for (let j = startingMinute; j <= 5; j++) {
										if (state.individualDates[idx].times[i])
											makeTime(
												state.individualDates[idx].times[i][j],
												'team',
												state.inTimeColor
											);
									}
								} else if (i === d.end_hours) {
									for (let j = 0; j < endMinute; j++) {
										if (state.individualDates[idx].times[i])
											makeTime(
												state.individualDates[idx].times[i][j],
												'team',
												state.inTimeColor
											);
									}
								} else {
									state.individualDates[idx].timeBackColor[i] =
										state.inTimeColor;
									for (let j = 0; j <= 5; j++) {
										if (state.individualDates[idx].times[i])
											makeTime(
												state.individualDates[idx].times[i][j],
												'team',
												state.inTimeColor
											);
									}
								}
							}
						}
					})
			);
		},
		LOGIN_EVERYTIME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = 'everyTime';
		},
		cloneIndividualDates: (state, action: PayloadAction<make_days[]>) => {
			state.cloneDateSuccess = true;
		},
		POST_EVERYTIME_SUCCESS: (state, action: PayloadAction<any>) => {
			state.loginSuccess = false;
			state.postHomePrepare = false;
			state.postHomeSuccess = true;
		},
		POST_EVERYTIME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
			state.postHomeSuccess = false;
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
		initialTimeMode: (state) => {
			state.inTimeMode = '';
		},
		checkInMode: (
			state,
			action: PayloadAction<{ time: number; idx: number; day: string }>
		) => {
			const { time, idx, day } = action.payload;
			state.dayString = day;
			state.inTimeMode = '';
			state.dayIdx = idx;
			state.setTime = time;
			let modeSelect = [
				{
					count: 0,
					content: 'normal'
				},
				{
					count: 0,
					content: 'team'
				},
				{
					count: 0,
					content: 'home'
				},
				{
					count: 0,
					content: 'everyTime'
				}
			];
			state.individualDates[idx].times[time].forEach((t) => {
				modeSelect.forEach((mode) => {
					mode.content === t.mode && mode.count++;
				});
			});

			modeSelect.sort((a, b) => b.count - a.count);

			modeSelect.forEach((mode) => {
				if (mode.count) {
					state.inTimeMode += mode.content;
				}
			});
			// state.inTimeMode = modeSelect[0].content;
		},
		makePostHomeDates: (state) => {
			const data = {
				starting_hours: state.startTime.hour,
				starting_minutes: state.startTime.minute,
				end_hours: state.endTime.hour,
				end_minutes: state.endTime.minute
			};
			delete state.everyTime['club'];
			delete state.everyTime['is_temporary_reserved'];
			state.everyTime[state.dayString].push(data);
			state.postHomePrepare = true;
		},
		checkHomeIstBlank: (state) => {
			let isNonColor = 0;
			const dayIdx = state.dayIdx;
			const endHour = state.endTime.hour;
			const endMinute = Math.round(state.endTime.minute / 10);
			console.log(endMinute);
			state.isHomeTimePicked = false;
			state.individualDates[dayIdx].times[endHour].forEach((t, idx) => {
				if (idx < endMinute) t.mode !== 'normal' && isNonColor++;
			});

			if (isNonColor !== 0) {
				Alert.alert('알림', '이미 지정된 시간 입니다', [
					{
						text: '확인',
						onPress: () => {}
					}
				]);
				state.isHomeTimePicked = true;
				state.inTimeMode = '';
			}
		},
		deleteHomeTime: (state, action: PayloadAction<findTime[]>) => {
			const findTime = action.payload;
			const startHour = findTime[0].startTime.hour;

			state.everyTime[state.dayString] = state.everyTime[
				state.dayString
			].filter((time) => time.starting_hours !== startHour);

			state.postHomePrepare = true;
		},
		setTodayDate: (state, action: PayloadAction<number>) => {
			state.todayDate = action.payload;
		},
		initialIndividualError: (state) => {
			state.error = '';
		},
		setIndividualTimeColor: (state, action: PayloadAction<string>) => {
			state.inTimeColor = action.payload;
		},
		POST_IMAGE_SUCCESS: (state, action: PayloadAction<responseImageAPI>) => {},
		POST_IMAGE_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		}
	},
	extraReducers: {}
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
	makePostHomeDates,
	initialTimeMode,
	checkHomeIstBlank,
	deleteHomeTime,
	setTodayDate,
	cloneHomeDate,
	makeHomeTime,
	initialIndividualError,
	setIndividualTimeColor,
	setEveryTimeData
} = individualSlice.actions;

export default individualSlice.reducer;
