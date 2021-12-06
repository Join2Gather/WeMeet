import type { make60 } from './timetable';
import type { confirmDates } from './login';
export interface individual {
	individualDates: make60[];
	error: string;
	everyTime: responseEveryTime;
	weekIndex: Array<string>;
	loginSuccess: boolean;
	cloneDateSuccess: boolean;
	confirmDatesTimetable: confirmDatesType[];
	confirmClubs: Array<string>;
	individualTimesText: Array<string>;
}

export interface postImageAPI {
	image: string;
	token: string;
}
export interface loginEveryTimeAPI {
	id: string;
	password: string;
}

export interface responseImageAPI {
	sun: Array<string>;
	mon: Array<string>;
	tue: Array<string>;
	wed: Array<string>;
	thu: Array<string>;
	fri: Array<string>;
	sat: Array<string>;
}

export interface individualTime {
	sun: { time: Array<string> };
	mon: { time: Array<string> };
	tue: { time: Array<string> };
	wed: { time: Array<string> };
	thu: { time: Array<string> };
	fri: { time: Array<string> };
	sat: { time: Array<string> };
}

export interface responseEveryTime {
	sun: Array<responseTime>;
	mon: Array<responseTime>;
	tue: Array<responseTime>;
	wed: Array<responseTime>;
	thu: Array<responseTime>;
	fri: Array<responseTime>;
	sat: Array<responseTime>;
	[prop: string]: responseTime[];
}

export interface confirmDatesType {
	sun: Array<responseTime>;
	mon: Array<responseTime>;
	tue: Array<responseTime>;
	wed: Array<responseTime>;
	thu: Array<responseTime>;
	fri: Array<responseTime>;
	sat: Array<responseTime>;
	color: string;
	club: {
		name: string;
	};
	[prop: string]: any;
}

export interface responseTime {
	starting_hours: number;
	starting_minutes: number;
	end_hours: number;
	end_minutes: number;
}

export interface postEveryTimeAPI {
	user: number;
	id: number;
	data: responseEveryTime;
	token: string;
}
