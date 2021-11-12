import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/team';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type {
	joinTeamAPI,
	requestTeamAPI,
	responseTeamAPI,
	shareUriAPI,
	team,
} from '../interface';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
const POST_TEAM = 'team/POST_TEAM';
const SHARE_URI = 'team/SHARE_URI';
const JOIN_TEAM = 'team/JOIN_TEAM';
export const postTeamName = createAction(
	POST_TEAM,
	(data: requestTeamAPI) => data
);
export const shareUri = createAction(SHARE_URI, (data: shareUriAPI) => data);
export const joinTeam = createAction(JOIN_TEAM, (data: joinTeamAPI) => data);

const postTeamSaga = createRequestSaga(POST_TEAM, api.postTeamName);
const shareURISaga = createRequestSaga(SHARE_URI, api.shareUri);
const joinTeamSaga = createRequestSaga(JOIN_TEAM, api.joinTeam);

export function* teamSaga() {
	yield takeLatest(POST_TEAM, postTeamSaga);
	yield takeLatest(SHARE_URI, shareURISaga);
	yield takeLatest(JOIN_TEAM, joinTeamSaga);
}

const initialState: team = {
	joinUri: '',
	date: {},
	joinName: '',
	error: '',
	user: 0,
	name: '',
	id: 0,
	joinTeam: false,
	joinTeamError: false,
};

export const teamSlice = createSlice({
	name: 'team',
	initialState,
	reducers: {
		POST_TEAM_SUCCESS: (state, action: PayloadAction<responseTeamAPI>) => {
			state.date = action.payload.date;
			state.joinUri = action.payload.uri;
		},
		POST_TEAM_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		SHARE_URI_SUCCESS: (state, action: PayloadAction<any>) => {
			state.joinUri = action.payload.uri;
			Clipboard.setString(state.joinUri);
			Alert.alert('클립보드에 초대 링크가 복사 되었습니다');
		},
		SHARE_URI_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		JOIN_TEAM_SUCCESS: (state, action: PayloadAction<any>) => {
			state.id = action.payload.id;
			state.joinName = decodeURI(action.payload.name);
			state.joinUri = action.payload.uri;
			state.joinTeam = !state.joinTeam;
			state.joinTeamError = false;
		},
		JOIN_TEAM_FAILURE: (state, action: PayloadAction<any>) => {
			// Alert.alert('초대 코드가 올바르지 않습니다');
			state.joinTeamError = true;
			state.joinName = '';
			state.joinUri = '';
		},
		initialError: (state) => {
			state.joinTeamError = false;
		},
		inputTeamName: (state, action: PayloadAction<string>) => {
			state.name = action.payload;
		},
	},
	extraReducers: {},
});

export const { inputTeamName, initialError } = teamSlice.actions;

export default teamSlice.reducer;
