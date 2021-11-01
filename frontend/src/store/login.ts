import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Login } from '../interface';

const initialState: Login = {
	id: 0,
	name: '',
	user: 0,
	token: '',
	clubs: [],
	kakaoDates: [],
	uri: '',
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
			state.kakaoDates = action.payload.kakaoDates[0];
		},
		findURI: (state, action: PayloadAction<string>) => {
			const data = state.clubs.find((club) => club.name === action.payload);
			if (data) {
				state.uri = data.uri;
			}
		},
	},
	extraReducers: {},
});

export const { getSocialLogin, findURI } = loginSlice.actions;

export default loginSlice.reducer;
