import type { time, timetable } from '../../interface';
import { hexToRGB } from './hexToRGB';

export function makeIndividualTimetable(state: timetable) {
	state.weekIndex.map((day, idx) =>
		state.responseIndividual[day].map((d) => {
			state.postIndividualDates[day].push(d);
			state.dates[idx].times.map((inDay) => {
				if (d.starting_hours === inDay.time) {
					for (let i = d.starting_hours - 8; i <= d.end_hours - 8; i++) {
						if (i + 8 == d.starting_hours) {
							state.dates[idx].times[i].color = state.color;
							state.dates[idx].times[i].isPicked = true;
							state.dates[idx].times[i].startPercent =
								(1 - d.starting_minutes / 60) * 100;
							state.dates[idx].times[i].mode = 'start';
						} else if (i + 8 == d.end_hours) {
							state.dates[idx].times[i].color = state.color;
							state.dates[idx].times[i].isPicked = true;
							state.dates[idx].times[i].endPercent = (d.end_minutes / 60) * 100;
							state.dates[idx].times[i].mode = 'end';
						} else {
							state.dates[idx].times[i].color = state.color;
							state.dates[idx].times[i].isPicked = true;
							state.dates[idx].times[i].isFullTime = true;
						}
					}
				}
			});
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
				const startingMinute = Math.round(d.starting_minutes / 10) * 10;
				const endMinute = Math.round(d.end_minutes / 10) * 10;
				console.log(startingMinute, endMinute);
				for (let i = d.starting_hours; i <= d.end_hours; i++) {
					if (i === d.starting_hours) {
						for (let j = startingMinute / 10; j < 6; j++) {
							state.teamDatesWith60[idx].times[i][
								j
							].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
							state.teamDatesWith60[idx].times[i][j].isEveryTime = false;
							state.teamDatesWith60[idx].times[i][j].isPicked = true;
							state.teamDatesWith60[idx].times[i][j].mode = 'start';
						}
					} else if (i === d.end_hours) {
						for (let j = 0; j <= endMinute / 10; j++) {
							state.teamDatesWith60[idx].times[i][
								j
							].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
							state.teamDatesWith60[idx].times[i][j].isEveryTime = false;
							state.teamDatesWith60[idx].times[i][j].isPicked = true;
							state.teamDatesWith60[idx].times[i][j].mode = 'start';
						}
					} else {
						for (let j = 0; j <= 5; j++) {
							state.teamDatesWith60[idx].times[i][
								j
							].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
							state.teamDatesWith60[idx].times[i][j].isEveryTime = false;
							state.teamDatesWith60[idx].times[i][j].isPicked = true;
						}
					}
				}
			});
		});
}

export function makeGroupTimetable(state: timetable) {
	const result = hexToRGB(state.color);

	result &&
		state.weekIndex.map((day, idx) => {
			state.responseGroup[day].avail_time.map((d, idxNumber) => {
				state.teamDates[idx].times.map((inDay) => {
					if (d.starting_hours === inDay.time) {
						const color =
							state.responseGroup[day].count[idxNumber] / state.peopleCount;
						for (let i = d.starting_hours - 8; i <= d.end_hours - 8; i++) {
							if (i + 8 == d.starting_hours) {
								if (state.teamDates[idx].times[i].isPicked) {
									state.teamDates[idx].times[i].mode = 'several';
									state.teamDates[idx].times[
										i
									].secondColor = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
								} else {
									state.teamDates[idx].times[
										i
									].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
									state.teamDates[idx].times[i].isPicked = true;
									state.teamDates[idx].times[i].startPercent =
										(1 - d.starting_minutes / 60) * 100;
									state.teamDates[idx].times[i].mode = 'start';
								}
							} else if (i + 8 == d.end_hours) {
								// if (state.teamDates[idx].times[i].isPicked) {
								// } else {
								state.teamDates[idx].times[
									i
								].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
								state.teamDates[idx].times[i].isPicked = true;
								state.teamDates[idx].times[i].endPercent =
									(d.end_minutes / 60) * 100;
								state.teamDates[idx].times[i].mode = 'end';
								// }
							} else {
								state.teamDates[idx].times[
									i
								].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
								state.teamDates[idx].times[i].isPicked = true;
								state.teamDates[idx].times[i].isFullTime = true;
							}
						}
					}
				});
			});
		});
}
