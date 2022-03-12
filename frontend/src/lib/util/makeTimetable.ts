import { curry, map, pipe, range, reduce, toArray, filter } from '@fxts/core';
import type { state_time, timeWith60 } from '../../interface';
export function makeTimetableWithStartEnd(startHour: number, endHour: number) {
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
	const makeMinute = pipe(
		range(6),
		map((m) => makeMinuteData(m * 10)),
		toArray
	);

	const makeTime = pipe(
		range(startHour, endHour + 1),
		map((k) => ({ [k]: makeMinute })),
		reduce(Object.assign)
	);

	const makeColor = pipe(
		range(startHour, endHour + 1),
		map((_) => '#fff'),
		toArray
	);
	const makeHourToText = curry((hour: number) => {
		return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
	});
	const makeTimeText = pipe(
		range(startHour, endHour + 1),
		filter((h) => (startHour % 2 ? h % 2 : (h + 1) % 2)),
		map(makeHourToText),
		toArray
	);
	console.log(makeTimeText);
	const weekTimetableData = [
		{ day: 'sun', times: makeTime, timeBackColor: makeColor },
		{ day: 'mon', times: makeTime, timeBackColor: makeColor },
		{ day: 'tue', times: makeTime, timeBackColor: makeColor },
		{ day: 'wed', times: makeTime, timeBackColor: makeColor },
		{ day: 'thu', times: makeTime, timeBackColor: makeColor },
		{ day: 'fri', times: makeTime, timeBackColor: makeColor },
		{ day: 'sat', times: makeTime, timeBackColor: makeColor }
	];

	return { weekTimetableData, makeTimeText };
}

makeTimetableWithStartEnd(0, 2);
