import login, {
	setConfirmProve,
	initialState,
	changeInPersistColor,
	toggleViewError,
	loginSaga,
	setTimeTipVisible,
	setHomeTime,
	findHomeTime,
	findTeam,
	setAlarmTime,
	setAppleToken,
	setAppLoading
} from './login';
import type { Login } from '../interface/login';
import * as api from '../lib/api/login';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import type { nicknameAPI, appleLoginType } from '../interface/login';
import { cloneDeep } from 'lodash';
jest.mock('react-redux');

describe('login  reducer', () => {
	let initial: Login;
	beforeEach(() => {
		initial = initialState;
	});
	it('팀 찾기 [findTeam]', () => {
		let obj = cloneDeep(initial);
		obj.clubs.push({
			id: 32,
			people_count: 1,
			name: 'We Meet',
			uri: 'xxx',
			color: '#cb0d1f',
			starting_hours: 9,
			end_hours: 22
		});
		const state = login(obj, findTeam({ data: 'We Meet', use: 'name' }));
		expect(state.name).toEqual('We Meet');
	});
	it('모임 확정 토글 [setConfirmProve]', () => {
		const state = login(initial, setConfirmProve(true));
		expect(state.isConfirmProve === true);
	});
	it('홈 시간 찾기 [findHomeTime]', () => {
		let obj = cloneDeep(initial);
		obj.inDates['mon'].push(
			{
				start: { hour: 11, minute: 30 },
				end: { hour: 12, minute: 30 },
				name: '개인 시간표'
			},
			{
				start: { hour: 14, minute: 30 },
				end: { hour: 18, minute: 30 },
				name: 'We Meet'
			}
		);
		const state = login(obj, findHomeTime({ day: 'mon', time: 15 }));
		expect(state.findIndividual).toHaveLength;
	});
	it('알람 시간 설정 [setAlarmTime]', () => {
		const state = login(initial, setAlarmTime(10));
		expect(state.alarmTime).toEqual(10);
	});
	it('애플 로그인 토큰 설정 [setAppleToken]', () => {
		const state = login(initial, setAppleToken('token'));
		expect(state.token).toEqual('token');
	});
	it('홈 화면 시간 지정 [setHomeTime]', () => {
		const state = login(initial, setHomeTime({ start: 9, end: 20 }));
		expect(state.homeTime.start).toEqual(9);
		expect(state.homeTime.end).toEqual(20);
	});
	it('로딩 설정 [setAppLoading]', () => {
		const state = login(initial, setAppLoading('loading'));
		expect(state.loading).toEqual('loading');
	});
	it('로그인 저장 색 지정 [changeInPersistColor]', () => {
		const state = login(
			initial,
			changeInPersistColor({ color: '#FFFF', use: 'theme' })
		);
		expect(state.inThemeColor).toEqual('#FFFF');
	});
	it('시간표 팁 설정 [setTimeTipVisible]', () => {
		const state = login(initial, setTimeTipVisible(true));
		expect(state.timeTipVisible).toEqual(true);
	});
	it('화면 에러 토글 [toggleViewError]', () => {
		const state = login(initial, toggleViewError(false));
		expect(state.viewError).toEqual(false);
	});

	it('홈 화면 시간 터치 시간 찾기', () => {
		// const state = login(initial, findHomeTime({ day: '1', time: 20 }));
	});
});

describe('login Saga test', () => {
	let state: Login;
	const token = 'enter your token';

	it('로그인 성공', async () => {
		const mockingResponse = {
			id: 9,
			clubs: [
				{
					id: 32,
					people_count: 1,
					name: 'We Meet',
					uri: 'aa',
					color: '#cb0d1f',
					starting_hours: 9,
					end_hours: 22
				}
			],
			dates: [],
			nickname: 'ss',
			name: '장동현',
			user: 12
		};
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.provide([[call(api.getUserMe, { token }), { data: mockingResponse }]])
			.put({
				type: 'LOADING/startLoading',
				payload: 'login/USER_ME'
			})
			.put({
				type: 'login/USER_ME_SUCCESS',
				payload: mockingResponse
			})
			.put({
				type: 'LOADING/endLoading',
				payload: 'login/USER_ME'
			})
			.dispatch({ type: 'login/USER_ME', payload: { token } })
			.silentRun();
		expect(storeState.name).toEqual('장동현');
	});
	it('로그인 실패', async () => {
		const action = 'USER_ME';
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.provide([
				[
					call(api.getUserMe, { token: '1111' }),
					new Error('Page Not Found 404')
				]
			])
			.put({
				type: 'LOADING/startLoading',
				payload: `login/${action}`
			})
			.put({
				type: 'LOADING/endLoading',
				payload: `login/${action}`
			})
			.dispatch({ type: 'login/USER_ME', payload: { token: '1111' } })
			.silentRun();
		expect(storeState.error).toEqual('error');
	});
	it('닉네임 변경 성공', async () => {
		const data: nicknameAPI = {
			id: 9,
			user: 12,
			nickname: '장동현',
			token: '123'
		};
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.provide([
				[call(api.changeNickname, data), { data: { nickname: '장동현' } }]
			])
			.put({
				type: 'LOADING/startLoading',
				payload: 'login/CHANGE_NICKNAME'
			})
			.put({
				type: 'login/CHANGE_NICKNAME_SUCCESS',
				payload: { nickname: '장동현' }
			})
			.put({
				type: 'LOADING/endLoading',
				payload: 'login/CHANGE_NICKNAME'
			})
			.dispatch({ type: 'login/CHANGE_NICKNAME', payload: data })
			.silentRun();
		expect(storeState.nickname).toEqual('장동현');
	});
	it('닉네임 변경 실패', async () => {
		const action = 'CHANGE_NICKNAME';
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.provide([
				[
					call(api.getUserMe, { token: '1111' }),
					new Error('Page Not Found 404')
				]
			])
			.put({
				type: 'LOADING/startLoading',
				payload: `login/${action}`
			})
			.put({
				type: 'LOADING/endLoading',
				payload: `login/${action}`
			})
			.dispatch({ type: 'login/CHANGE_NICKNAME', payload: { token: '1111' } })
			.silentRun();
		expect(storeState.error).toEqual('nickname error');
	});
	it('애플 로그인 성공', async () => {
		const data: appleLoginType = {
			code: '',
			email: 'ww8007@hanmail.net'
		};
		const action = 'APPLE_LOGIN';
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.provide([
				[call(api.appleLogin, data), { data: { access_token: '1111' } }]
			])
			.put({
				type: 'LOADING/startLoading',
				payload: `login/${action}`
			})
			.put({
				type: `login/${action}_SUCCESS`,
				payload: { access_token: '1111' }
			})
			.put({
				type: 'LOADING/endLoading',
				payload: `login/${action}`
			})
			.dispatch({ type: `login/${action}`, payload: data })
			.silentRun();
		expect(storeState.token).toEqual('1111');
	});
	it('애플 로그인 실패', async () => {
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.dispatch({ type: 'LOADING/startLoading' })
			.dispatch({ type: 'login/APPLE_LOGIN', payload: { token: '1111' } })
			.provide([
				[
					call(api.getUserMe, { token: '1111' }),
					new Error('Page Not Found 404')
				]
			])
			.silentRun();
		expect(storeState.error).toEqual('appleLogin error');
	});
});
