export interface timetable {
	dates: make_days[];
	teamDates: make_days[];
	startTime: number;
	endTime: number;
	// selectTimes: [selectDays, selectDays];
	selectTime: selectDay;
	day: string;
	dayIdx: number;
}

export interface changeColorType {
	idx: number;
	time: number;
}

export interface selectDay {
	sun: Array<number>;
	mon: Array<number>;
	tue: Array<number>;
	wed: Array<number>;
	thu: Array<number>;
	fri: Array<number>;
	sat: Array<number>;
	// 인덱스 시그니처
	[prop: string]: any;
}

export interface days {
	sun: Array<Number>;
	mon: Array<Number>;
	tue: Array<Number>;
	wed: Array<Number>;
	thu: Array<Number>;
	fri: Array<Number>;
	sat: Array<Number>;
	club: string;
	is_temporary_reserved: boolean;
}
export interface default_dates {}

export interface time {
	timeText: string;
	time: number;
	color: string;
}
export interface make_days {
	day: string;
	times: Array<state_time>;
}

export interface state_time {
	time: number;
	color: string;
	isFullTime: boolean;
}
