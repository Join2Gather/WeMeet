import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/login';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type {
	homeTime,
	kakaoLoginAPI,
	Login,
	nicknameAPI,
	userMeAPI,
} from '../interface';
import { startCase } from 'lodash';

const initialState: Login = {
	id: 0,
	name: '',
	user: 0,
	token: '',
	clubs: [],
	kakaoDates: [],
	uri: '',
	error: '',
	color: '',
	peopleCount: 0,
	response: '',
	confirmDatesTimetable: [],
	confirmClubs: [],
	userMeSuccess: true,
	startHour: 0,
	endHour: 0,
	dates: [],
	individualColor: '#33aafc',
	nickname: '',
	findIndividual: [],
	inDates: {
		sun: [],
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: [],
	},
	weekIndex: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
	joinClubNum: 0,
	confirmClubNum: 0,
	appleUser: null,
	isConfirmProve: false,
	alarmTime: 1,
	homeTime: {
		start: 0,
		end: 24,
	},
	loading: '',
};

const USER_ME = 'login/USER_ME';
const CHANGE_NICKNAME = 'login/CHANGE_NICKNAME';

export const getUserMe = createAction(USER_ME, (data: userMeAPI) => data);
export const changeNickname = createAction(
	CHANGE_NICKNAME,
	(data: nicknameAPI) => data
);

const getUserMeSaga = createRequestSaga(USER_ME, api.getUserMe);
const changeNickSaga = createRequestSaga(CHANGE_NICKNAME, api.changeNickname);

export function* loginSaga() {
	yield takeLatest(USER_ME, getUserMeSaga);
	yield takeLatest(CHANGE_NICKNAME, changeNickSaga);
}

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		getSocialLogin: (state, action: PayloadAction<kakaoLoginAPI>) => {
			const { id, clubs, dates, kakaoDates, name, token, user } =
				action.payload;
			state.kakaoDates = [];
			state.clubs = [];
			state.id = id;
			state.name = name;
			state.user = user;
			state.token = token;
			state.clubs = clubs;
			state.clubs.map((club) => {
				club.name = decodeURIComponent(club.name);
			});
			state.kakaoDates = kakaoDates;
			state.dates = dates;
		},
		findTeam: (
			state,
			action: PayloadAction<{ uri?: string; name?: string; id?: string }>
		) => {
			let data;
			let dateInfo;
			if (action.payload.name) {
				data = state.clubs.find((club) => club.name === action.payload.name);
			} else if (action.payload.uri) {
				data = state.clubs.find((club) => club.uri === action.payload.uri);
			} else if (action.payload.id) {
				data = state.clubs.find((club) => club?.id === action.payload.id);
				dateInfo = state.dates.find(
					(date: any) => date?.club?.id === action.payload.id
				);
			}
			if (data && dateInfo) {
				state.name = data.name;
				state.uri = data.uri;
				state.color = data.color;
				state.peopleCount = data.people_count;
				state.startHour = data.starting_hours;
				state.endHour = data.end_hours;
				state.isConfirmProve = !dateInfo.is_temporary_reserved;
			} else {
				state.name = data.name;
				state.uri = data.uri;
				state.color = data.color;
				state.peopleCount = data.people_count;
				state.startHour = data.starting_hours;
				state.endHour = data.end_hours;
				state.isConfirmProve = false;
			}
		},
		confirmProve: (state) => {
			state.isConfirmProve = true;
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
					};
					state.findIndividual = [...state.findIndividual, data];
				}
			});
		},
		USER_ME_SUCCESS: (state, action: PayloadAction<any>) => {
			state.confirmClubs = [];
			state.inDates = {
				sun: [],
				mon: [],
				tue: [],
				wed: [],
				thu: [],
				fri: [],
				sat: [],
			};
			const { clubs, dates, nickname } = action.payload;
			state.dates = dates;
			state.joinClubNum = clubs.length;
			state.nickname = nickname;
			state.confirmDatesTimetable = dates.filter(
				(da: any) => !da.is_temporary_reserved
			);
			state.confirmDatesTimetable.forEach((day: any) => {
				const find = clubs.find((date: any) => date.id === day.club?.id);
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
							const data = {
								start: {
									hour: d.starting_hours,
									minute: d.starting_minutes,
								},
								end: {
									hour: d.end_hours,
									minute: d.end_minutes,
								},
								color: day.color,
								name: day.club === null ? '개인 시간표' : day.club.name,
							};
							state.inDates[dayString] = [...state.inDates[dayString], data];
						});
					}
				});
			});
			state.clubs = action.payload.clubs;
			state.clubs.map((club) => {
				club.name = decodeURIComponent(club.name);
			});
			state.userMeSuccess = true;
		},
		USER_ME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
			state.userMeSuccess = false;
		},
		CHANGE_NICKNAME_SUCCESS: (state, action: PayloadAction<any>) => {
			state.nickname = action.payload.nickname;
		},
		CHANGE_NICKNAME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		makeGroupColor: (state, action: PayloadAction<string>) => {
			state.color = action.payload;
		},
		changeTeamColor: (state, action: PayloadAction<string>) => {
			state.individualColor = action.payload;
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
	},
	extraReducers: {},
});

export const {
	getSocialLogin,
	findTeam,
	makeGroupColor,
	changeTeamColor,
	findHomeTime,
	setAlarmTime,
	setAppleToken,
	confirmProve,
	setHomeTime,
	setAppLoading,
} = loginSlice.actions;

export default loginSlice.reducer;
