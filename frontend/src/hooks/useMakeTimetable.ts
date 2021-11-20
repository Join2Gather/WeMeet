import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import type { time, state_time, timeWith60 } from '../interface';
import { useEffect } from 'react';
import { cloneDates } from '../store/timetable';
import { cloneIndividualDates } from '../store/individual';

export function useMakeTimeTableWith60() {
	const times: timeWith60 = {
		6: [],
		7: [],
		8: [],
		9: [],
		10: [],
		11: [],
		12: [],
		13: [],
		14: [],
		15: [],
		16: [],
		17: [],
		18: [],
		19: [],
		20: [],
		21: [],
		22: [],
		23: [],
		24: [],
		25: [],
		26: [],
	};
	const timesText: Array<string> = [];

	for (let i = 6; i <= 26; i++) {
		for (let j = 0; j <= 50; j += 10) {
			times[i].push({
				color: Colors.white,
				isPicked: false,
				mode: 'normal',
				isEveryTime: false,
				minute: j,
			});
		}
		if (i <= 12) {
			if (i % 2 === 0) {
				timesText.push(`${i} AM`);
			}
		} else {
			if (i % 2 === 0) {
				timesText.push(`${i - 12} PM`);
			}
		}
	}
	const defaultDatesWith60 = [
		{ day: 'sun', times: times },
		{ day: 'mon', times: times },
		{ day: 'tue', times: times },
		{ day: 'wed', times: times },
		{ day: 'thu', times: times },
		{ day: 'fri', times: times },
		{ day: 'sat', times: times },
	];
	return { defaultDatesWith60, timesText };
}

export function useMakeTimetable() {
	const times: Array<state_time> = [];
	const timesText: Array<string> = [];

	for (let i = 6; i <= 26; i += 1) {
		times.push({
			time: i,
			color: Colors.white,
			isPicked: false,
			endPercent: 100,
			startPercent: 100,
			mode: 'normal',
			isEveryTime: false,
			isFullTime: false,
		});
		if (i <= 12) {
			if (i % 2 === 0) {
				timesText.push(`${i} AM`);
			}
		} else {
			if (i % 2 === 0) {
				timesText.push(`${i - 12} PM`);
			}
		}
	}

	const defaultDates = [
		{ day: 'sun', times: times },
		{ day: 'mon', times: times },
		{ day: 'tue', times: times },
		{ day: 'wed', times: times },
		{ day: 'thu', times: times },
		{ day: 'fri', times: times },
		{ day: 'sat', times: times },
	];

	return { defaultDates, timesText };
}
