import { Colors } from 'react-native-paper';
import type { Login } from '../../interface/login';

export function changeTeamInfo(
	state: Login,
	data: any,
	isConfirmProve: boolean
) {
	state.name = data.name;
	state.uri = data.uri;
	state.color = data.color;
	state.peopleCount = data.people_count;
	state.startHour = data.starting_hours;
	state.endHour = data.end_hours;
	state.isConfirmProve = isConfirmProve ? true : false;
}

export const loginInitialState: Login = {
	id: 0,
	name: '',
	user: 0,
	token: '',
	clubs: [],
	kakaoDates: [],
	uri: '',
	error: '',
	color: '',
	peopleCount: 0,
	response: '',
	confirmDatesTimetable: [],
	confirmClubs: [],
	userMeSuccess: true,
	startHour: 0,
	endHour: 0,
	dates: [],
	inThemeColor: '#33aafc',
	nickname: '',
	findIndividual: [],
	inDates: {
		sun: [],
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: []
	},
	weekIndex: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
	joinClubNum: 0,
	confirmClubNum: 0,
	appleUser: '',
	isConfirmProve: false,
	alarmTime: 1,
	homeTime: {
		start: 0,
		end: 25
	},
	loading: '',
	seeTips: true,
	seeTimeTips: true,
	code: '',
	email: '',
	viewError: false,
	timeTipVisible: true,
	inTimeColor: Colors.grey600
};

export function setUserMeData(state: Login, action: any) {
	state.confirmClubs = [];
	state.inDates = {
		sun: [],
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: []
	};
	const { clubs, dates, nickname, id, name, user } = action.payload;
	state.id = id;
	state.name = name;
	state.dates = dates;
	state.user = user;
	state.joinClubNum = clubs.length;
	state.nickname = nickname;
	state.clubs = clubs;
	state.dates = dates;

	state.error = '';
}
