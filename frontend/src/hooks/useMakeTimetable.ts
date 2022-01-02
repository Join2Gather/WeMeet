import { Colors } from 'react-native-paper';
import type { state_time, timeWith60 } from '../interface';

export function useMakeTimeTableWith60(startHour: number, endHour: number) {
	const times: timeWith60 = {};
	const timesText: Array<string> = [];

	for (let i = startHour; i < endHour; i++) {
		times[i] = [];
		for (let j = 0; j <= 50; j += 10) {
			if (j === 0) {
				times[i].push({
					color: Colors.white,
					mode: 'normal',
					minute: j,
					borderBottom: false,
					borderTop: true,
					borderWidth: 0.3,
				});
			} else {
				times[i].push({
					color: Colors.white,
					mode: 'normal',
					minute: j,
					borderBottom: false,
					borderTop: false,
					borderWidth: 0.3,
				});
			}
		}

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

	for (let i = 0; i <= 24; i += 1) {
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
				if (i === 0) timesText.push('12 AM');
				else timesText.push(`${i} AM`);
			}
		} else if (i > 24) {
			if (i % 2 === 0) {
				timesText.push(`${i - 24} AM`);
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
