import type { individual, time, timetable } from '../../interface';
import { hexToRGB } from './hexToRGB';
import { Colors } from 'react-native-paper';

const greyColor = Colors.grey400;

export function makeIndividualTimetable(state: timetable) {
	const color = state.color;
	state.dates;
	state.weekIndex.map((day, idx) =>
		state.responseIndividual[day].map((d, idxNumber) => {
			const startingMinute = Math.round(d.starting_minutes / 10);
			const endMinute = Math.round(d.end_minutes / 10);

			for (let i = d.starting_hours; i <= d.end_hours; i++) {
				if (d.starting_hours === d.end_hours) {
					for (let j = startingMinute; j <= endMinute; j++) {
						makeTime(state.dates[idx].times[i][j], 'individual', color);
					}
				} else {
					if (i === d.starting_hours) {
						for (let j = startingMinute; j <= 5; j++) {
							if (state.dates[idx].times[i][j].color !== Colors.white) {
								makeTime(
									state.dates[idx].times[i][j],
									'individual',
									Colors.black
								);
								state.isOverlap = true;
							} else
								makeTime(state.dates[idx].times[i][j], 'individual', color);
						}
					} else if (i === d.end_hours) {
						for (let j = 0; j < endMinute; j++) {
							if (state.dates[idx].times[i][j].color !== Colors.white) {
								makeTime(
									state.dates[idx].times[i][j],
									'individual',
									Colors.black
								);
								state.isOverlap = true;
							} else
								makeTime(state.dates[idx].times[i][j], 'individual', color);
						}
					} else {
						for (let j = 0; j <= 5; j++) {
							if (state.dates[idx].times[i][j].color !== Colors.white) {
								makeTime(
									state.dates[idx].times[i][j],
									'individual',
									Colors.black
								);
								state.isOverlap = true;
							} else
								makeTime(state.dates[idx].times[i][j], 'individual', color);
						}
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
				const colorCount =
					state.responseGroup[day].count[idxNumber] / state.peopleCount;
				const color = `rgba(${result.r}, ${result.g}, ${result.b}, ${colorCount})`;
				const startingMinute = Math.round(d.starting_minutes / 10);
				const endMinute = Math.round(d.end_minutes / 10);

				for (let i = d.starting_hours; i <= d.end_hours; i++) {
					if (d.starting_hours === d.end_hours) {
						for (let j = startingMinute; j <= endMinute; j++) {
							makeTime(dates[idx].times[i][j], 'team', color);
						}
					} else {
						if (i === d.starting_hours) {
							for (let j = startingMinute; j <= 5; j++) {
								makeTime(dates[idx].times[i][j], 'team', color);
							}
						} else if (i === d.end_hours) {
							for (let j = 0; j < endMinute; j++) {
								makeTime(dates[idx].times[i][j], 'team', color);
							}
						} else {
							for (let j = 0; j <= 5; j++) {
								makeTime(dates[idx].times[i][j], 'team', color);
							}
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
					if (d.starting_hours === d.end_hours) {
						for (let j = startingMinute; j <= endMinute; j++) {
							makeTime(
								state.individualDates[idx].times[i][j],
								'team',
								greyColor
							);
						}
					} else {
						if (i === d.starting_hours) {
							for (let j = startingMinute; j <= 5; j++) {
								if (state.individualDates[idx].times[i]) {
									makeTime(
										state.individualDates[idx].times[i][j],
										'everyTime',
										greyColor
									);
								}
							}
						} else if (i === d.end_hours) {
							for (let j = 0; j < endMinute; j++) {
								if (state.individualDates[idx].times[i]) {
									makeTime(
										state.individualDates[idx].times[i][j],
										'everyTime',
										greyColor
									);
								}
							}
						} else {
							for (let j = 0; j <= 5; j++) {
								if (state.individualDates[idx].times[i]) {
									makeTime(
										state.individualDates[idx].times[i][j],
										'everyTime',
										greyColor
									);
								}
							}
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
					if (i <= state.startHour && i >= state.endHour) {
						if (d.starting_hours === d.end_hours) {
							for (let j = startingMinute; j <= endMinute; j++) {
								makeTime(date[idx].times[i][j], 'everyTime', greyColor);
							}
						} else {
							if (i === d.starting_hours) {
								for (let j = startingMinute; j <= 5; j++) {
									makeTime(
										date[idx].times[i][j].times[i][j],
										'everyTime',
										greyColor
									);
								}
							} else if (i === d.end_hours) {
								for (let j = 0; j < endMinute; j++) {
									makeTime(
										date[idx].times[i][j].times[i][j],
										'everyTime',
										greyColor
									);
								}
							} else {
								for (let j = 0; j <= 5; j++) {
									makeTime(
										date[idx].times[i][j].times[i][j],
										'everyTime',
										greyColor
									);
								}
							}
						}
					}
				}
			})
		);
	}
}

export function makeConfirmWith(
	state: timetable,
	dates: any,
	isGroup: boolean
) {
	state.confirmDatesTimetable.map((date) => {
		state.weekIndex.map((day, idx) => {
			date[day].map((d: any) => {
				const startingMinute = Math.round(d.starting_minutes / 10);
				const endMinute = Math.round(d.end_minutes / 10);
				if (state.teamName !== date.club?.name) {
					for (let i = d.starting_hours; i <= d.end_hours; i++) {
						if (d.starting_hours === d.end_hours) {
							for (let j = startingMinute; j <= endMinute; j++) {
								makeTime(dates[idx]?.times[i][j], 'other', greyColor);
							}
						} else {
							if (i === d.starting_hours) {
								for (let j = startingMinute; j <= 5; j++) {
									if (dates[idx].times[i]) {
										makeTime(dates[idx]?.times[i][j], 'other', greyColor);
									}
								}
							} else if (i === d.end_hours) {
								for (let j = 0; j < endMinute; j++) {
									if (dates[idx].times[i]) {
										makeTime(dates[idx]?.times[i][j], 'other', greyColor);
									}
								}
							} else {
								for (let j = 0; j <= 5; j++) {
									if (dates[idx].times[i]) {
										makeTime(dates[idx]?.times[i][j], 'other', greyColor);
									}
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
	const color = state.color;
	state.createdDate = created_date.slice(0, 10);
	state.weekIndex.map((day, idx) =>
		dates[day].map((d: any) => {
			const startingMinute = Math.round(d.starting_minutes / 10);
			const endMinute = Math.round(d.end_minutes / 10);
			for (let i = d.starting_hours; i <= d.end_hours; i++) {
				if (d.starting_hours === d.end_hours) {
					for (let j = startingMinute; j <= endMinute; j++) {
						makeTime(state.snapShotDate[idx].times[i][j], 'start', color);
					}
				} else {
					if (i === d.starting_hours) {
						for (let j = startingMinute; j <= 5; j++) {
							makeTime(state.snapShotDate[idx].times[i][j], 'start', color);
						}
					} else if (i === d.end_hours) {
						for (let j = 0; j < endMinute; j++) {
							makeTime(state.snapShotDate[idx].times[i][j], 'start', color);
						}
					} else {
						for (let j = 0; j <= 5; j++) {
							makeTime(state.snapShotDate[idx].times[i][j], 'start', color);
						}
					}
				}
			}
		})
	);
}

export function deleteDate(
	state: timetable,
	date: any,
	startHour: number,
	startMinute: number,
	endHour: number,
	endMinute: number,
	dayIdx: number
) {
	for (let i = startHour; i <= endHour; i++) {
		if (i === startHour) {
			for (let j = startMinute; j <= 5; j++) {
				date[dayIdx].times[i][j].color = Colors.white;
				if (j === 0 || j === 7) {
					date[dayIdx].times[i][j].borderTop = true;
					date[dayIdx].times[i][j].borderBottom = true;
				}
			}
		} else if (i === endHour) {
			for (let j = 0; j < endMinute; j++) {
				date[dayIdx].times[i][j].color = Colors.white;
				date[dayIdx].times[i][j].mode = 'start';
				if (j === 0 || j === 7) {
					date[dayIdx].times[i][j].borderTop = true;
					date[dayIdx].times[i][j].borderBottom = true;
				}
			}
		} else {
			for (let j = 0; j <= 5; j++) {
				date[dayIdx].times[i][j].color = Colors.white;
				if (j === 0 || j === 7) {
					date[dayIdx].times[i][j].borderTop = true;
					date[dayIdx].times[i][j].borderBottom = true;
				}
			}
		}
	}
}

export function makeTime(changeTime: any, mode: string, funcColor: string) {
	if (changeTime) {
		changeTime.color = funcColor;
		changeTime.mode = mode;
		changeTime.borderWidth = 0.3;
		// changeTime.borderBottom = false;
		changeTime.borderTop = false;
	}
}
