export interface timetable {
	dates: default_days;
	startTime: number;
	endTime: number;
	// selectTimes: [selectDays, selectDays];
	selectTime: selectDay;
	day: string;
}

export interface selectDays {
	[key: string]: Array<number>;
}

export interface selectDay {
	sun: Array<any>;
	mon: Array<any>;
	tue: Array<any>;
	wed: Array<any>;
	thu: Array<any>;
	fri: Array<any>;
	sat: Array<any>;
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
export interface default_days {
	sun: make_days;
	mon: make_days;
	tue: make_days;
	wed: make_days;
	thu: make_days;
	fri: make_days;
	sat: make_days;
}

export interface time {
	timeText: string;
	time: number;
	color: string;
}
export interface make_days {
	day: string;
	times: Array<time>;
}

export interface state_time {
	time: number;
	color: string;
	check: boolean;
}
