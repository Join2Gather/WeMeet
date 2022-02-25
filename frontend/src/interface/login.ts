import { findTime, timeProps, timeType } from '.';
import type { responseEveryTime, confirmDatesType } from './individual';

export interface Login {
	id: number;
	name: string;
	user: number;
	token: string;
	clubs: Array<any>;
	kakaoDates: Array<any>;
	uri: string;
	error: string;
	everyTime: confirmDates;
	peopleCount: number;
	response: '';
	confirmDatesTimetable: Array<confirmDatesType>;
	confirmClubs: Array<string>;
	userMeSuccess: boolean;
	startHour: number;
	endHour: number;
	dates: dates[];
	nickname: string;
	findIndividual: findTime[];
	inDates: inDates;
	weekIndex: string[];
	joinClubNum: number;
	confirmClubNum: number;
	appleUser: string;
	isConfirmProve: boolean;
	alarmTime: number;
	homeTime: homeTime;
	loading: string;
	seeTips: boolean;
	seeTimeTips: boolean;
	code: string;
	email: string;
	viewError: boolean;
	timeTipVisible: boolean;
	color: string;
	inThemeColor: string;
	inTimeColor: string;
}

export interface homeTime {
	start: number;
	end: number;
}

export interface dates {
	sun: date[];
	mon: date[];
	tue: date[];
	wed: date[];
	thu: date[];
	fri: date[];
	sat: date[];
	club: {
		id: number;
		name: string;
	};
	is_temporary_reserved: boolean;
	color: string;
}

export interface appleLoginType {
	code: string;
	email: string;
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
	color?: string;
	name: string;
	id?: number;
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

export interface changeColor {
	color: string;
	use: string;
}
