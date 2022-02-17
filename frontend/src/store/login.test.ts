import login, {
	setConfirmProve,
	initialState,
	changeInPersistColor,
	toggleViewError,
	getUserMe,
	getUserMeSaga,
	loginSaga,
	changeNickSaga,
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
import { useDispatch } from 'react-redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { runSaga } from 'redux-saga';
import { startLoading } from './loading';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import type { nicknameAPI, appleLoginType } from '../interface/login';
import { cloneDeep } from 'lodash';
jest.mock('react-redux');

describe('login  reducer', () => {
	let initial: Login;
	const dispatch = jest.fn();
	const dispatched = [];
	let iter;
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
	const token =
		'rfa893c932dd142c28ee531bb1a92b08b.0.rvss.87TdhEUGO-cCD36l0F2cyQ';
	beforeEach(() => {
		state = initialState;
	});
	it('로그인 성공', async () => {
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.withState(state)
			.dispatch({ type: 'LOADING/startLoading' })
			.dispatch({
				type: 'login/USER_ME',
				payload: {
					token
				}
			})
			// .provide([[call(api.getUserMe, { token }), true]])
			.dispatch({ type: 'LOADING/endLoading', payload: 'login/USER_ME' })
			.silentRun();

		expect(storeState.name).toHaveLength;
	});
	it('로그인 실패', async () => {
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.dispatch({ type: 'LOADING/startLoading' })
			.dispatch({ type: 'login/USER_ME', payload: { token: '1111' } })
			.provide([
				[
					call(api.getUserMe, { token: '1111' }),
					new Error('Page Not Found 404')
				]
			])
			.silentRun();
		expect(storeState.error).toEqual('error');
	});
	it('닉네임 변경 성공', async () => {
		const data: nicknameAPI = {
			id: 9,
			user: 12,
			nickname: '장동현',
			token
		};
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.withState(state)
			.dispatch({ type: 'login/CHANGE_NICKNAME', payload: data })
			// .provide([[call(api.changeNickname, data), true]])
			.put({ type: 'LOADING/startLoading', payload: 'login/CHANGE_NICKNAME' })
			.put({
				type: 'LOADING/endLoading',
				payload: 'login/CHANGE_NICKNAME'
			})
			.silentRun();
		expect(storeState.nickname).toEqual('장동현');
	});
	it('닉네임 변경 실패', async () => {
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.dispatch({ type: 'LOADING/startLoading' })
			.dispatch({ type: 'login/CHANGE_NICKNAME', payload: { token: '1111' } })
			.provide([
				[
					call(api.getUserMe, { token: '1111' }),
					new Error('Page Not Found 404')
				]
			])
			.silentRun();
		expect(storeState.error).toEqual('nickname error');
	});
	it('애플 로그인 성공', async () => {
		const data: appleLoginType = {
			code: '',
			email: 'ww8007@hanmail.net'
		};
		const { storeState } = await expectSaga(loginSaga)
			.withReducer(login)
			.withState(state)
			.dispatch({ type: 'LOADING/startLoading' })
			.dispatch({
				type: 'login/APPLE_LOGIN',
				payload: data
			})
			// .provide([[call(api.getUserMe, { token }), true]])
			.dispatch({
				type: 'LOADING/endLoading',
				payload: 'login/APPLE_LOGIN'
			})
			.silentRun();
		// expect(storeState.nickname).toEqual('장동현');
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
