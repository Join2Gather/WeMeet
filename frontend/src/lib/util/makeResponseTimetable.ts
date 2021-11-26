import type { time, timetable } from '../../interface';
import { hexToRGB } from './hexToRGB';

export function makeIndividualTimetable(state: timetable) {
	state.weekIndex.map((day, idx) =>
		state.responseIndividual[day].map((d, idxNumber) => {
			state.postIndividualDates[day].push(d);

			const startingMinute = Math.round(d.starting_minutes / 10);
			const endMinute = Math.round(d.end_minutes / 10);
			for (let i = d.starting_hours; i <= d.end_hours; i++) {
				if (i === d.starting_hours) {
					for (let j = startingMinute; j <= 6; j++) {
						state.dates[idx].times[i][j].color = state.color;
						state.dates[idx].times[i][j].isEveryTime = false;
						state.dates[idx].times[i][j].isPicked = true;
						state.dates[idx].times[i][j].mode = 'start';
						state.dates[idx].times[i][j].borderTop = false;
						state.dates[idx].times[i][j].borderBottom = false;
					}
				} else if (i === d.end_hours) {
					for (let j = 0; j <= endMinute; j++) {
						state.dates[idx].times[i][j].color = state.color;
						state.dates[idx].times[i][j].isEveryTime = false;
						state.dates[idx].times[i][j].isPicked = true;
						state.dates[idx].times[i][j].mode = 'start';
						state.dates[idx].times[i][j].borderTop = false;
						state.dates[idx].times[i][j].borderBottom = false;
					}
				} else {
					for (let j = 0; j <= 6; j++) {
						state.dates[idx].times[i][j].color = state.color;
						state.dates[idx].times[i][j].isEveryTime = false;
						state.dates[idx].times[i][j].isPicked = true;
						state.dates[idx].times[i][j].borderTop = false;
						state.dates[idx].times[i][j].borderBottom = false;
					}
				}
			}
		})
	);
}

export function makeGroupTimeTableWith60(state: timetable) {
	const result = hexToRGB(state.color);

	result &&
		state.weekIndex.map((day, idx) => {
			state.responseGroup[day].avail_time.map((d, idxNumber) => {
				const color =
					state.responseGroup[day].count[idxNumber] / state.peopleCount;
				const startingMinute = Math.round(d.starting_minutes / 10);
				const endMinute = Math.round(d.end_minutes / 10);

				for (let i = d.starting_hours; i <= d.end_hours; i++) {
					if (i === d.starting_hours) {
						for (let j = startingMinute; j <= 6; j++) {
							state.teamDatesWith60[idx].times[i][
								j
							].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
							state.teamDatesWith60[idx].times[i][j].isEveryTime = false;
							state.teamDatesWith60[idx].times[i][j].isPicked = true;
							state.teamDatesWith60[idx].times[i][j].mode = 'start';
							state.teamDatesWith60[idx].times[i][j].borderTop = false;
							state.teamDatesWith60[idx].times[i][j].borderBottom = false;
						}
					} else if (i === d.end_hours) {
						for (let j = 0; j <= endMinute; j++) {
							state.teamDatesWith60[idx].times[i][
								j
							].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
							state.teamDatesWith60[idx].times[i][j].isEveryTime = false;
							state.teamDatesWith60[idx].times[i][j].isPicked = true;
							state.teamDatesWith60[idx].times[i][j].mode = 'start';
							state.teamDatesWith60[idx].times[i][j].borderTop = false;
							state.teamDatesWith60[idx].times[i][j].borderBottom = false;
						}
					} else {
						for (let j = 0; j <= 6; j++) {
							state.teamDatesWith60[idx].times[i][
								j
							].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
							state.teamDatesWith60[idx].times[i][j].isEveryTime = false;
							state.teamDatesWith60[idx].times[i][j].borderTop = false;
							state.teamDatesWith60[idx].times[i][j].borderBottom = false;
						}
					}
				}
			});
		});
}
