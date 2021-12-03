import type { responseEveryTime } from './individual';

export interface Login {
	id: number;
	name: string;
	user: number;
	token: string;
	clubs: Array<any>;
	kakaoDates: Array<any>;
	uri: string;
	error: string;
	color: string;
	peopleCount: number;
	response: '';
	confirmDatesTimetable: Array<responseEveryTime>;
	confirmClubs: Array<string>;
	userMeSuccess: boolean;
	startHour: number;
	endHour: number;
	dates: any;
}

export interface kakaoLoginAPI {
	id: number;
	name: string;
	user: number;
	token: string;
	clubs: Array<any>;
	kakaoDates: Array<any>;
	dates: any;
}

export interface confirmDates {
	sun: [];
	mon: [];
	tue: [];
	wed: [];
	thu: [];
	fri: [];
	sat: [];
	[prop: string]: any;
}

export interface userMeAPI {
	user: number;
	id: number;
	token: string;
}
