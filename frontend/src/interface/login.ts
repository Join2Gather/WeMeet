import { findTime, timeProps, timeType } from '.';
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
	individualColor: string;
	nickname: string;
	findIndividual: findTime[];
	inDates: inDates;
	weekIndex: string[];
	joinClubNum: number;
	confirmClubNum: number;
	appleUser: string | null;
	isConfirmProve: boolean;
	alarmTime: number;
	homeTime: homeTime;
	loading: string;
	seeTips: boolean;
	seeTimeTips: boolean;
}

export interface homeTime {
	start: number;
	end: number;
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

export interface inDates {
	sun: date[];
	mon: date[];
	tue: date[];
	wed: date[];
	thu: date[];
	fri: date[];
	sat: date[];
	[prop: string]: date[];
}

export interface date {
	start: timeType;
	end: timeType;
	color: string;
	name: string;
	id: number;
}

export interface userMeAPI {
	token: string;
}

export interface nicknameAPI {
	id: number;
	user: number;
	token: string;
	nickname: string;
}

export interface findHome {
	startTime: timeType;
	endTime: timeType;
	color: string;
	name: string;
}
