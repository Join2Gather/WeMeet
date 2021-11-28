import type {
	responseTime,
	confirmDatesType,
	responseEveryTime,
} from './individual';
export interface timetable {
	dates: make60[];
	teamDatesWith60: make60[];
	startTime: number;
	endTime: number;
	startMinute: number;
	endMinute: number;
	selectTime: selectDay;
	day: string;
	responseIndividual: responseIndividualTimetable;
	responseGroup: responseTeamTimetable;
	dayIdx: number;
	weekIndex: weekIndex;
	postIndividualDates: postIndividualDates;
	postDatesPrepare: boolean;
	confirmDatesPrepare: boolean;
	postConfirmSuccess: boolean;
	error: string;
	isTimePicked: boolean;
	isTimeNotExist: boolean;
	everyTime: responseEveryTime;
	color: string;
	peopleCount: number;
	confirmDates: confirmDates;
	timeMode: string;
	confirmDatesTimetable: confirmDatesType[];
	confirmClubs: Array<string>;
	startHour: number;
	endHour: number;
	makeReady: boolean;
	timesText: Array<string>;
}

export type weekIndex = Array<string>;

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

export interface make60 {
	day: string;
	times: timeWith60;
}

export interface state_time {
	time: number;
	color: string;
	secondColor?: string;
	isPicked: boolean;
	isFullTime: boolean;
	startPercent: number;
	endPercent: number;
	mode: string;
	isEveryTime: boolean;
}

export interface timeWith60 {
	// 0: timeProps[];
	// 1: timeProps[];
	// 2: timeProps[];
	// 3: timeProps[];
	// 4: timeProps[];
	// 5: timeProps[];
	// 6: timeProps[];
	// 7: timeProps[];
	// 8: timeProps[];
	// 9: timeProps[];
	// 10: timeProps[];
	// 11: timeProps[];
	// 12: timeProps[];
	// 13: timeProps[];
	// 14: timeProps[];
	// 15: timeProps[];
	// 16: timeProps[];
	// 17: timeProps[];
	// 18: timeProps[];
	// 19: timeProps[];
	// 20: timeProps[];
	// 21: timeProps[];
	// 22: timeProps[];
	// 23: timeProps[];
	// 24: timeProps[];
	[prop: string]: timeProps[];
}

export interface timeProps {
	color: string;
	isPicked: boolean;
	mode: string;
	isEveryTime: boolean;
	minute: number;
	borderWidth: number;
	borderColor: string;
	borderTop: boolean;
	borderBottom: boolean;
}

export interface postIndividualDates {
	sun: post_time[];
	mon: post_time[];
	tue: post_time[];
	wed: post_time[];
	thu: post_time[];
	fri: post_time[];
	sat: post_time[];
	[prop: string]: any;
}

export interface confirmDates {
	sun: post_time[];
	mon: post_time[];
	tue: post_time[];
	wed: post_time[];
	thu: post_time[];
	fri: post_time[];
	sat: post_time[];
	[prop: string]: post_time[];
}

// 개별 일정 받아오기
export interface requestIndividualDatesAPI {
	id: number;
	uri: string;
	user: number;
	token: string;
}

// 팀 일정 받아오기
export interface requestGroupDatesAPI {
	user: number;
	uri: string;
	id: number;
	token: string;
}

// 개별 일정 보내기
export interface postIndividualDatesAPI {
	dates: postIndividualDates;
	id: number;
	user: number;
	uri: string;
	token: string;
}

// 그룹 확정 시간 보내기
export interface postConfirmAPI {
	date: postIndividualDates;
	id: number;
	user: number;
	uri: string;
	token: string;
}

export interface post_time {
	starting_hours: number;
	starting_minutes: number;
	end_hours: number;
	end_minutes: number;
}

export interface responseIndividualTimetable {
	sun: Array<responseTime>;
	mon: Array<responseTime>;
	tue: Array<responseTime>;
	wed: Array<responseTime>;
	thu: Array<responseTime>;
	fri: Array<responseTime>;
	sat: Array<responseTime>;
	[prop: string]: responseTime[];
}

export interface responseTeamTimetable {
	sun: groupTime;
	mon: groupTime;
	tue: groupTime;
	wed: groupTime;
	thu: groupTime;
	fri: groupTime;
	sat: groupTime;
	[prop: string]: groupTime;
}

export interface groupTime {
	avail_time: responseTime[];
	count: Array<number>;
	avail_people: string[];
}
