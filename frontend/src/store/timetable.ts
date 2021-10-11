import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/team';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type {
	default_days,
	requestTeamAPI,
	responseTeamAPI,
	selectDay,
	state_time,
	team,
	timetable,
} from '../interface';

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
	dates: {
		sun: { day: 'sun', times: [] },
		mon: { day: 'mon', times: [] },
		tue: { day: 'tue', times: [] },
		thu: { day: 'thu', times: [] },
		wed: { day: 'wed', times: [] },
		fri: { day: 'fri', times: [] },
		sat: { day: 'sat', times: [] },
	},
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
};

export const timetableSlice = createSlice({
	name: 'timetable',
	initialState,
	reducers: {
		cloneDates: (state, action: PayloadAction<default_days>) => {
			state.dates = action.payload;
		},
		setStartHour: (state, action: PayloadAction<number>) => {
			state.startTime = action.payload;
		},
		setEndHour: (state, action: PayloadAction<number>) => {
			state.startTime = action.payload;
		},
		setStartMin: (state, action: PayloadAction<number>) => {
			state.startTime = state.startTime + action.payload / 100;
		},
		setEndMin: (state, action: PayloadAction<number>) => {
			state.startTime = state.endTime + action.payload / 100;
		},
		pushSelectStart: (state, action: PayloadAction<number>) => {
			state.selectTime[state.day].push(action.payload);
		},
		pushSelectEnd: (state, action: PayloadAction<number>) => {
			for (let i = state.startTime + 1; i < state.endTime; i++) {
				state.selectTimes.push(i);
			}
		},
	},
	extraReducers: {},
});

export const { cloneDates, setStartHour, setEndHour, setStartMin, setEndMin } =
	timetableSlice.actions;

export default timetableSlice.reducer;
