import { Colors } from 'react-native-paper';
import type { state_time, timeWith60 } from '../interface';
import { map, pipe, range, reduce, toArray } from '@fxts/core';
export function useMakeTimeTableWith60(startHour: number, endHour: number) {
	const times: timeWith60 = {};
	const timesText: Array<string> = [];
	const timeBackColor: Array<string> = [];

	for (let i = startHour; i <= endHour; i++) {
		if (i < endHour) {
			times[i] = [];
			for (let j = 0; j <= 50; j += 10) {
				if (j === 0) {
					times[i].push({
						color: Colors.white,
						mode: 'normal',
						minute: j,
						borderBottom: false,
						borderTop: true,
						borderWidth: 0.3
					});
				} else {
					times[i].push({
						color: Colors.white,
						mode: 'normal',
						minute: j,
						borderBottom: false,
						borderTop: false,
						borderWidth: 0.3
					});
				}
			}
		}
		timeBackColor.push('#fff');
		if (startHour % 2) {
			if (i <= 12) {
				if ((i + 1) % 2 === 0) {
					if (i === 0) timesText.push('12 AM');
					else timesText.push(`${i} AM`);
				}
			} else {
				if ((i + 1) % 2 === 0) {
					timesText.push(`${i - 12} PM`);
				}
			}
		} else {
			if (i <= 12) {
				if (i % 2 === 0) {
					if (i === 0) timesText.push('12 AM');
					else timesText.push(`${i} AM`);
				}
			} else {
				if (i % 2 === 0) {
					timesText.push(`${i - 12} PM`);
				}
			}
		}
	}

	const defaultDatesWith60 = [
		{ day: 'sun', times: times, timeBackColor: timeBackColor },
		{ day: 'mon', times: times, timeBackColor: timeBackColor },
		{ day: 'tue', times: times, timeBackColor: timeBackColor },
		{ day: 'wed', times: times, timeBackColor: timeBackColor },
		{ day: 'thu', times: times, timeBackColor: timeBackColor },
		{ day: 'fri', times: times, timeBackColor: timeBackColor },
		{ day: 'sat', times: times, timeBackColor: timeBackColor }
	];
	return { defaultDatesWith60, timesText };
}

export function makeTimetableWithStartEnd(startHour: number, endHour: number) {
	const makeColor = pipe(
		range(startHour, endHour),
		map((_) => '#fff'),
		toArray
	);
	const makeTime = pipe(
		range(startHour, endHour),
		map((k) => ({ [k]: makeMinute })),
		reduce(Object.assign)
	);
	const makeMinute = pipe(
		range(6),
		map((m) => makeMinuteData(m * 10)),
		toArray
	);
	const makeMinuteData = (minute: number) => {
		return {
			color: '#fff',
			mode: 'normal',
			minute,
			borderBottom: false,
			borderTop: minute == 0 ? true : false,
			borderWidth: 0.3
		};
	};
}
