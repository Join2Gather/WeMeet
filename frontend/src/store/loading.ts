import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface initialLoading {
	[prop: string]: any;
}

const initialState: initialLoading = {};

export const loadingSlice = createSlice({
	name: 'LOADING',
	initialState: initialState,
	reducers: {
		startLoading: (state, action: PayloadAction<string>) => ({
			...state,
			[action.payload]: true,
		}),
		endLoading: (state, action: PayloadAction<string>) => ({
			...state,
			[action.payload]: false,
		}),
	},
});

export const { startLoading, endLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
