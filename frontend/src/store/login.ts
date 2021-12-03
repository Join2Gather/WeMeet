import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/login';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type { kakaoLoginAPI, Login, userMeAPI } from '../interface';

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
	userMeSuccess: false,
	startHour: 0,
	endHour: 0,
	dates: [],
};

const USER_ME = 'login/USER_ME';

export const getUserMe = createAction(USER_ME, (data: userMeAPI) => data);

const getUserMeSaga = createRequestSaga(USER_ME, api.getUserMe);

export function* loginSaga() {
	yield takeLatest(USER_ME, getUserMeSaga);
}

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		getSocialLogin: (state, action: PayloadAction<kakaoLoginAPI>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.clubs = action.payload.clubs;
			state.clubs.map((club) => {
				club.name = decodeURIComponent(club.name);
			});
			state.kakaoDates = action.payload.kakaoDates;
		},
		findTeam: (
			state,
			action: PayloadAction<{ uri?: string; name?: string }>
		) => {
			let data;
			if (action.payload.name) {
				data = state.clubs.find((club) => club.name === action.payload.name);
			} else if (action.payload.uri) {
				data = state.clubs.find((club) => club.uri === action.payload.uri);
			}
			if (data) {
				state.uri = data.uri;
				state.color = data.color;
				state.peopleCount = data.people_count;
				state.startHour = data.starting_hours;
				state.endHour = data.end_hours;
			}
		},
		USER_ME_SUCCESS: (state, action: PayloadAction<any>) => {
			state.confirmClubs = [];
			const { clubs, dates } = action.payload;
			const confirmDatesTimetable = dates.filter(
				(da: any) => !da.is_temporary_reserved
			);
			state.confirmDatesTimetable = confirmDatesTimetable.filter(
				(day: any) => day.club !== null
			);
			state.confirmDatesTimetable.forEach((day: any) => {
				const find = clubs.find((date: any) => date.id === day.club?.id);
				if (find) {
					day['color'] = find.color;
					state.confirmClubs.push(find.color);
				}
			});
			state.clubs = action.payload.clubs;
			state.clubs.map((club) => {
				club.name = decodeURIComponent(club.name);
			});
			state.userMeSuccess = true;
		},
		USER_ME_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		makeGroupColor: (state, action: PayloadAction<string>) => {
			state.color = action.payload;
		},
	},
	extraReducers: {},
});

export const { getSocialLogin, findTeam, makeGroupColor } = loginSlice.actions;

export default loginSlice.reducer;
