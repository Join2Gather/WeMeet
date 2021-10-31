import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { changeColorType, timetable } from '../interface';
import { Colors } from 'react-native-paper';

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
	startMinute: 0,
	endMinute: 0,
	weekIndex: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
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
			state.startMinute = action.payload;
		},
		setStartPercentage: (state) => {
			const find = state.dates[state.dayIdx].times.find(
				(d) => d.time === state.startTime
			);
			if (find) {
				find.color = Colors.blue200;
				find.isFullTime = true;
				find.startPercent = (1 - state.startMinute / 60) * 100;
				find.mode = 'start';
			}
		},
		removeStartPercentage: (state) => {
			const find = state.dates[state.dayIdx].times.find(
				(d) => d.time === state.startTime
			);
			if (find) {
				find.color = Colors.white;
				find.isFullTime = false;
				find.startPercent = 0;
				find.mode = 'normal';
			}
		},
		setEndMin: (state, action: PayloadAction<number>) => {
			state.endMinute = action.payload;
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
				i <= Math.floor(state.endTime);
				i++
			) {
				state.dates[state.dayIdx].times[i - 8].color = Colors.blue200;
				if (i === Math.floor(state.endTime)) {
					state.dates[state.dayIdx].times[i - 8].isFullTime = true;
					state.dates[state.dayIdx].times[i - 8].endPercent =
						(state.endMinute / 60) * 100;
					state.dates[state.dayIdx].times[i - 8].mode = 'end';
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
	pushSelectStart,
	changeAllColor,
	setDay,
	setStartPercentage,
	removeStartPercentage,
} = timetableSlice.actions;

export default timetableSlice.reducer;
