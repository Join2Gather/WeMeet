import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/team';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type { requestTeamAPI, responseTeamAPI, team } from '../interface';

const POST_TEAM = 'team/POST_TEAM';

export const postTeamName = createAction(
	POST_TEAM,
	(data: requestTeamAPI) => data
);

const postTeamSaga = createRequestSaga(POST_TEAM, api.postTeamName);

export function* teamSaga() {
	yield takeLatest(POST_TEAM, postTeamSaga);
}

const initialState: team = {
	uri: '',
	date: {},
	name: '',
	error: '',
};

export const timetableSlice = createSlice({
	name: 'timetable',
	initialState,
	reducers: {},
	extraReducers: {},
});

export const {} = timetableSlice.actions;

export default timetableSlice.reducer;
