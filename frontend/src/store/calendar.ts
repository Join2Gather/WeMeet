import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Counter } from '../interface';
import { Colors } from 'react-native-paper';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);
type Day = {};
const initialState = {
	day: {},
	today: dayjs().tz('Asia/Seoul').locale('ko').format('YYYY-MM-DD'),
};

export const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
		addDay: (state, action: PayloadAction<any>) => {
			if (
				dayjs(state.today).isBefore(action.payload) &&
				dayjs(state.today).month === dayjs(action.payload).month
			) {
				if (state.day[action.payload]) {
					delete state.day[action.payload];
				} else {
					state.day[action.payload] = {
						selected: true,
						disableTouchEvent: false,
						selectedColor: Colors.blue800,
						selectedTextColor: Colors.white,
					};
				}
			}
		},
		removeAllDays: (state) => {
			state.day = {};
		},
	},
});

export const { addDay, removeAllDays } = calendarSlice.actions;

export default calendarSlice.reducer;
