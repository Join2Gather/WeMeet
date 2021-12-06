import type { individual, time, timetable } from '../../interface';
import { hexToRGB } from './hexToRGB';
import { Colors } from 'react-native-paper';
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

export function makeGroupTimeTableWith60(state: timetable, dates: any) {
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
							dates[idx].times[i][
								j
							].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
							dates[idx].times[i][j].isEveryTime = false;
							dates[idx].times[i][j].isPicked = true;
							dates[idx].times[i][j].mode = 'start';
							dates[idx].times[i][j].borderTop = false;
							dates[idx].times[i][j].borderBottom = false;
						}
					} else if (i === d.end_hours) {
						for (let j = 0; j <= endMinute; j++) {
							dates[idx].times[i][
								j
							].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
							dates[idx].times[i][j].isEveryTime = false;
							dates[idx].times[i][j].isPicked = true;
							dates[idx].times[i][j].mode = 'start';
							dates[idx].times[i][j].borderTop = false;
							dates[idx].times[i][j].borderBottom = false;
						}
					} else {
						for (let j = 0; j <= 6; j++) {
							dates[idx].times[i][
								j
							].color = `rgba(${result.r}, ${result.g}, ${result.b}, ${color})`;
							dates[idx].times[i][j].isEveryTime = false;
							dates[idx].times[i][j].borderTop = false;
							dates[idx].times[i][j].borderBottom = false;
						}
					}
				}
			});
		});
}

export function makeHomeTimetable(state: individual) {
	state.weekIndex.map(
		(day, idx) =>
			state.everyTime[day]?.length &&
			state.everyTime[day]?.map((d) => {
				const startingMinute = Math.round(d.starting_minutes / 10);
				const endMinute = Math.round(d.end_minutes / 10);

				for (let i = d.starting_hours; i <= d.end_hours; i++) {
					if (i === d.starting_hours) {
						for (let j = startingMinute; j <= 6; j++) {
							state.individualDates[idx].times[i][j].color = Colors.grey400;
							state.individualDates[idx].times[i][j].isEveryTime = false;
							state.individualDates[idx].times[i][j].isPicked = true;
							state.individualDates[idx].times[i][j].mode = 'start';
							state.individualDates[idx].times[i][j].borderBottom = false;
							state.individualDates[idx].times[i][j].borderTop = false;
						}
					} else if (i === d.end_hours) {
						for (let j = 0; j < endMinute; j++) {
							state.individualDates[idx].times[i][j].color = Colors.grey400;
							state.individualDates[idx].times[i][j].isEveryTime = false;
							state.individualDates[idx].times[i][j].isPicked = true;
							state.individualDates[idx].times[i][j].mode = 'start';
							state.individualDates[idx].times[i][j].borderBottom = false;
							state.individualDates[idx].times[i][j].borderTop = false;
						}
					} else {
						for (let j = 0; j <= 6; j++) {
							state.individualDates[idx].times[i][j].color = Colors.grey400;
							state.individualDates[idx].times[i][j].isEveryTime = false;
							state.individualDates[idx].times[i][j].isPicked = true;
							state.individualDates[idx].times[i][j].borderBottom = false;
							state.individualDates[idx].times[i][j].borderTop = false;
						}
					}
				}
			})
	);
}

export function addEveryTime(state: timetable, date: any) {
	if (state.everyTime) {
		state.weekIndex.map((day, idx) =>
			state.everyTime[day].map((d) => {
				const startingMinute = Math.round(d.starting_minutes / 10);
				const endMinute = Math.round(d.end_minutes / 10);
				for (let i = d.starting_hours; i <= d.end_hours; i++) {
					if (i === d.starting_hours) {
						for (let j = startingMinute; j <= 6; j++) {
							date[idx].times[i][j].color = Colors.grey400;
							date[idx].times[i][j].isEveryTime = true;
							date[idx].times[i][j].isPicked = true;
							date[idx].times[i][j].mode = 'start';
							date[idx].times[i][j].borderTop = false;
							date[idx].times[i][j].borderBottom = false;
						}
					} else if (i === d.end_hours) {
						for (let j = 0; j < endMinute; j++) {
							date[idx].times[i][j].color = Colors.grey400;
							date[idx].times[i][j].isEveryTime = true;
							date[idx].times[i][j].isPicked = true;
							date[idx].times[i][j].mode = 'start';
							date[idx].times[i][j].borderTop = false;
							date[idx].times[i][j].borderBottom = false;
						}
					} else {
						for (let j = 0; j <= 6; j++) {
							date[idx].times[i][j].color = Colors.grey400;
							date[idx].times[i][j].isEveryTime = true;
							date[idx].times[i][j].isPicked = true;
							date[idx].times[i][j].borderTop = false;
							date[idx].times[i][j].borderBottom = false;
						}
					}
				}
			})
		);
	}
}

export function makeConfirmWith(state: timetable, dates: any) {
	state.confirmDatesTimetable.map((date, idxNumber) => {
		state.weekIndex.map((day, idx) => {
			date[day].map((d: any) => {
				const startingMinute = Math.round(d.starting_minutes / 10);
				const endMinute = Math.round(d.end_minutes / 10);
				if (state.teamName !== date.club.name) {
					for (let i = d.starting_hours; i <= d.end_hours; i++) {
						if (i === d.starting_hours) {
							for (let j = startingMinute; j <= 6; j++) {
								if (dates[idx].times[i]) {
									dates[idx].times[i][j].color = Colors.grey400;
									dates[idx].times[i][j].isEveryTime = false;
									dates[idx].times[i][j].isPicked = true;
									dates[idx].times[i][j].mode = 'start';
									dates[idx].times[i][j].borderBottom = false;
									dates[idx].times[i][j].borderTop = false;
								}
							}
						} else if (i === d.end_hours) {
							for (let j = 0; j < endMinute; j++) {
								if (dates[idx].times[i]) {
									dates[idx].times[i][j].color = Colors.grey400;
									dates[idx].times[i][j].isEveryTime = false;
									dates[idx].times[i][j].isPicked = true;
									dates[idx].times[i][j].mode = 'start';
									dates[idx].times[i][j].borderBottom = false;
									dates[idx].times[i][j].borderTop = false;
								}
							}
						} else {
							for (let j = 0; j <= 6; j++) {
								if (dates[idx].times[i]) {
									dates[idx].times[i][j].color = Colors.grey400;
									dates[idx].times[i][j].isEveryTime = false;
									dates[idx].times[i][j].isPicked = true;
									dates[idx].times[i][j].borderBottom = false;
									dates[idx].times[i][j].borderTop = false;
								}
							}
						}
					}
				}
			});
		});
	});
}

export function makeSnapShotDate(
	state: timetable,
	created_date: any,
	dates: any
) {
	state.createdDate = created_date.slice(0, 10);
	state.weekIndex.map((day, idx) =>
		dates[day].map((d: any) => {
			const startingMinute = Math.round(d.starting_minutes / 10);
			const endMinute = Math.round(d.end_minutes / 10);
			for (let i = d.starting_hours; i <= d.end_hours; i++) {
				if (i === d.starting_hours) {
					for (let j = startingMinute; j <= 6; j++) {
						state.snapShotDate[idx].times[i][j].color = state.color;
						state.snapShotDate[idx].times[i][j].isEveryTime = false;
						state.snapShotDate[idx].times[i][j].isPicked = true;
						state.snapShotDate[idx].times[i][j].mode = 'start';
						state.snapShotDate[idx].times[i][j].borderTop = false;
						state.snapShotDate[idx].times[i][j].borderBottom = false;
					}
				} else if (i === d.end_hours) {
					for (let j = 0; j < endMinute; j++) {
						state.snapShotDate[idx].times[i][j].color = state.color;
						state.snapShotDate[idx].times[i][j].isEveryTime = false;
						state.snapShotDate[idx].times[i][j].isPicked = true;
						state.snapShotDate[idx].times[i][j].mode = 'start';
						state.snapShotDate[idx].times[i][j].borderTop = false;
						state.snapShotDate[idx].times[i][j].borderBottom = false;
					}
				} else {
					for (let j = 0; j <= 6; j++) {
						state.snapShotDate[idx].times[i][j].color = state.color;
						state.snapShotDate[idx].times[i][j].isEveryTime = false;
						state.snapShotDate[idx].times[i][j].isPicked = true;
						state.snapShotDate[idx].times[i][j].borderTop = false;
						state.snapShotDate[idx].times[i][j].borderBottom = false;
					}
				}
			}
		})
	);
}
