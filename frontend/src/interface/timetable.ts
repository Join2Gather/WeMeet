import type {
	responseTime,
	confirmDatesType,
	responseEveryTime,
} from './individual';
export interface timetable {
	dates: make60[];
	teamDatesWith60: make60[];
	snapShotDate: make60[];
	teamConfirmDate: make60[];
	teamURI: string;
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
	snapShotError: boolean;
	createdDate: string;
	reload: boolean;
	findTime: findTime[];
	teamName: string;
	isInTeamTime: boolean;
	selectTimeMode: string;
	modalMode: boolean;
	isPostRevertSuccess: boolean;
	startTimeText: string;
	confirmCount: number;
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
	[prop: string]: timeProps[];
}

export interface timeProps {
	color: string;
	mode: string;
	minute: number;
	borderWidth: number;
	borderColor?: string;
	borderTop?: boolean;
	borderBottom?: boolean;
	people?: Array<string>;
	startTime?: timeType;
	endTime?: timeType;
}

export interface findTime {
	people?: string[];
	color?: string;
	name?: string;
	startTime: timeType;
	endTime: timeType;
	selectTime: number;
	timeText?: string;
}

export interface timeType {
	hour: number;
	minute: number;
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

// 스냅샷 받아오기

export interface getSnapShotAPI {
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

export interface responseSnapShotTimetable {
	dates: responseIndividualTimetable;
	created_date: string;
}

export interface groupTime {
	avail_time: responseTime[];
	count: Array<number>;
	avail_people: any;
	idx?: number;
}

export interface makeTeam {
	startHour: number;
	endHour: number;
	color: string;
	peopleCount: number;
}
