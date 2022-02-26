import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/login';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type {
	appleLoginType,
	changeColor,
	homeTime,
	kakaoLoginAPI,
	Login,
	nicknameAPI,
	userMeAPI
} from '../interface';
import { Alert } from 'react-native';
import { Colors } from 'react-native-paper';
import {
	changeTeamInfo,
	loginInitialState,
	makeConfirmTimeData,
	setUserMeData
} from '../lib/util/loginReducerHelper';
import { filter, includes, map, pipe, range, reduce, take } from '@fxts/core';
import _, { toArray } from 'lodash';

export const initialState: Login = loginInitialState;

const USER_ME = 'login/USER_ME';
const CHANGE_NICKNAME = 'login/CHANGE_NICKNAME';
const APPLE_LOGIN = 'login/APPLE_LOGIN';

export const getUserMe = createAction(USER_ME, (data: userMeAPI) => data);
export const changeNickname = createAction(
	CHANGE_NICKNAME,
	(data: nicknameAPI) => data
);
export const appleLogin = createAction(
	APPLE_LOGIN,
	(data: appleLoginType) => data
);

export const getUserMeSaga = createRequestSaga(USER_ME, api.getUserMe);
export const changeNickSaga = createRequestSaga(
	CHANGE_NICKNAME,
	api.changeNickname
);
export const appleLoginSaga = createRequestSaga(APPLE_LOGIN, api.appleLogin);

export function* loginSaga() {
	yield takeLatest(USER_ME, getUserMeSaga);
	yield takeLatest(CHANGE_NICKNAME, changeNickSaga);
	yield takeLatest(APPLE_LOGIN, appleLoginSaga);
}

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		findTeam: (state, action: PayloadAction<{ data: string; use: string }>) => {
			const data = state.clubs.find(
				(club) => club[action.payload.use] == action.payload.data
			);
			if (action.payload.use == 'id') {
				changeTeamInfo(state, data);
			} else changeTeamInfo(state, data);
		},
		checkIsConfirmTeam: (state, action: PayloadAction<number>) => {
			const result = pipe(
				state.confirmDatesTimetable,
				map((c) => c.club?.id),
				includes(action.payload)
			);
			if (result) state.isConfirmProve = true;
		},
		setConfirmProve: (state, action: PayloadAction<boolean>) => {
			state.isConfirmProve = action.payload;
		},
		findHomeTime: (
			state,
			action: PayloadAction<{ day: string; time: number }>
		) => {
			state.findIndividual = [];
			const { day, time } = action.payload;
			state.inDates[day].forEach((d) => {
				if (d.start.hour <= time && d.end.hour >= time) {
					const data = {
						startTime: d.start,
						endTime: d.end,
						color: d.color,
						name: decodeURIComponent(d.name),
						selectTime: time,
						id: d.id
					};
					state.findIndividual = [...state.findIndividual, data];
				}
			});
		},

		setAlarmTime: (state, action: PayloadAction<number>) => {
			state.alarmTime = action.payload;
		},
		setAppleToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
		setHomeTime: (state, action: PayloadAction<homeTime>) => {
			state.homeTime.start = action.payload.start;
			state.homeTime.end = action.payload.end;
		},
		setAppLoading: (state, action: PayloadAction<string>) => {
			state.loading = action.payload;
		},
		setTipMode: (state, action: PayloadAction<boolean>) => {
			state.seeTips = action.payload;
		},
		toggleUserMeSuccess: (state) => {
			state.userMeSuccess = false;
		},
		toggleViewError: (state, action: PayloadAction<boolean>) => {
			state.viewError = action.payload;
		},
		setTimeTipVisible: (state, action: PayloadAction<boolean>) => {
			state.timeTipVisible = action.payload;
		},
		changeInPersistColor: (state, action: PayloadAction<changeColor>) => {
			const { color, use } = action.payload;
			if (use === 'theme') state.inThemeColor = color;
			else if (use === 'time') state.inTimeColor = color;
			else if (use === 'normal') state.color = color;
		},
		USER_ME_SUCCESS: (state, action: PayloadAction<any>) => {
			setUserMeData(state, action);
			// setConfirmDate(state);
			state.confirmDatesTimetable = state.dates.filter(
				(day: any) => !day.is_temporary_reserved
			);
			state.confirmDatesTimetable.forEach((day: any) => {
				const find = state.clubs.find((date: any) => date.id === day.club?.id);
				if (find) {
					day['color'] = find.color;
					day.club.name = decodeURIComponent(day.club.name);
				}
			});
			state.confirmClubNum =
				state.confirmDatesTimetable.length > 0
					? state.confirmDatesTimetable.length - 1
					: 0;
			state.confirmDatesTimetable.forEach((day: any) => {
				state.weekIndex.forEach((dayString) => {
					if (day[dayString].length) {
						day[dayString].map((d: any) => {
							state.inDates[dayString] = [
								...state.inDates[dayString],
								makeConfirmTimeData(d, day)
							];
						});
					}
				});
			});
			const find = state.dates.find((d) => d.club == null);
			if (find) {
				state.everyTime = find;
			}
			state.clubs.map((club) => {
				club.name = decodeURIComponent(club.name);
			});
			state.userMeSuccess = true;
		},
		USER_ME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = 'error';
			state.userMeSuccess = false;
		},
		CHANGE_NICKNAME_SUCCESS: (state, action: PayloadAction<any>) => {
			state.nickname = action.payload.nickname;
		},
		CHANGE_NICKNAME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = 'nickname error';
		},
		APPLE_LOGIN_SUCCESS: (state, action: PayloadAction<any>) => {
			state.token = action.payload.access_token;
		},
		APPLE_LOGIN_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = 'appleLogin error';
		}
	},
	extraReducers: {}
});

export const {
	findTeam,
	findHomeTime,
	setAlarmTime,
	setAppleToken,
	setConfirmProve,
	setHomeTime,
	setAppLoading,
	setTipMode,
	toggleUserMeSuccess,
	toggleViewError,
	setTimeTipVisible,
	changeInPersistColor,
	checkIsConfirmTeam
} = loginSlice.actions;

export default loginSlice.reducer;
