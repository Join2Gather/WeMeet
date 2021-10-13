import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/team';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type { changeColorType, team, timetable } from '../interface';
import { Colors } from 'react-native-paper';

// const POST_TEAM = 'team/POST_TEAM';

// export const postTeamName = createAction(
// 	POST_TEAM,
// 	(data: requestTeamAPI) => data
// );

// const postTeamSaga = createRequestSaga(POST_TEAM, api.postTeamName);

// export function* teamSaga() {
// 	yield takeLatest(POST_TEAM, postTeamSaga);
// }

const initialState: timetable = {
	dates: [
		{ day: 'sun', times: [] },
		{ day: 'mon', times: [] },
		{ day: 'tue', times: [] },
		{ day: 'thu', times: [] },
		{ day: 'wed', times: [] },
		{ day: 'fri', times: [] },
		{ day: 'sat', times: [] },
	],
	teamDates: [
		{ day: 'sun', times: [] },
		{ day: 'mon', times: [] },
		{ day: 'tue', times: [] },
		{ day: 'thu', times: [] },
		{ day: 'wed', times: [] },
		{ day: 'fri', times: [] },
		{ day: 'sat', times: [] },
	],
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
};

export const timetableSlice = createSlice({
	name: 'timetable',
	initialState,
	reducers: {
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
			state.startTime = state.startTime + action.payload / 100;
		},
		setEndMin: (state, action: PayloadAction<number>) => {
			state.endTime = state.endTime + action.payload / 100;
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
		changeColor: (state, action: PayloadAction<changeColorType>) => {
			state.dayIdx = action.payload.idx;
			const find = state.dates[action.payload.idx].times.find(
				(d) => d.time === action.payload.time
			);
			if (find) {
				find.color = Colors.blue200;
				find.isFullTime = true;
			}
		},
		changeAllColor: (state) => {
			for (
				let i = Math.floor(state.startTime);
				i < Math.floor(state.endTime);
				i++
			) {
				state.dates[state.dayIdx].times[i - 8].color = Colors.blue200;
				if (i === Math.floor(state.endTime) - 1) {
					state.dates[state.dayIdx].times[i - 8].isFullTime = true;
				}
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
	changeColor,
	pushSelectEnd,
	changeAllColor,
	setDay,
} = timetableSlice.actions;

export default timetableSlice.reducer;
