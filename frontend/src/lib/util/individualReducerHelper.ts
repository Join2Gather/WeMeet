import { Colors } from 'react-native-paper';
import { useMakeTimeTableWith60 } from '../../hooks';
import type { Individual } from '../../interface/individual';

const { defaultDatesWith60, timesText } = useMakeTimeTableWith60(0, 25);

export const individualInitialState: Individual = {
	individualDates: defaultDatesWith60,
	error: '',
	everyTime: {
		sun: [],
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: []
	},
	weekIndex: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
	loginSuccess: false,
	cloneDateSuccess: false,
	confirmDatesTimetable: [],
	confirmClubs: [],
	individualTimesText: timesText,
	startTime: {
		hour: 0,
		minute: 0
	},
	endTime: {
		hour: 0,
		minute: 0
	},
	inTimeMode: '',
	dayIdx: 0,
	dayString: '',
	isHomeTimePicked: false,
	postHomePrepare: false,
	postHomeSuccess: false,
	setTime: 0,
	todayDate: 0,
	individualCount: 0,
	groupCount: 0,
	homeTime: {
		start: 0,
		end: 24
	},
	inTimeColor: Colors.grey400
};
