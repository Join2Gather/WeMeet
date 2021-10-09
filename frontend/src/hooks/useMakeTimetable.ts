import { Colors } from 'react-native-paper';
import type { time, state_time } from '../interface';

export function useMakeTimetable() {
	const times: Array<state_time> = [];
	const timesText: Array<string> = [];

	for (let i = 8; i <= 24; i += 0.25) {
		times.push({ time: i, color: Colors.white });
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
