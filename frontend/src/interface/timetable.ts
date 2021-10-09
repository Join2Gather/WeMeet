export interface timetable {
	dates: default_days;
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
}
