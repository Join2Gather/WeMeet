import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Login } from '../interface';

const initialState: Login = {
	id: 0,
	name: '',
	user: 0,
	token: '',
	clubs: [],
	dates: [],
};

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		getSocialLogin: (state, action: PayloadAction<Login>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.clubs = action.payload.clubs;
			state.clubs.map((club) => {
				club.name = decodeURIComponent(club.name);
			});
			state.dates = action.payload.dates;
		},
	},
	extraReducers: {},
});

export const { getSocialLogin } = loginSlice.actions;

export default loginSlice.reducer;
