import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// interface loading {
//   sample/GET_POST: boolean;
//   sample/GET_USERS: boolean;
// }

// const initialState: loading = {
//   sample/GET_POST: true,
//   sample_GET_USERS: true,
// };

export const loadingSlice = createSlice({
  name: 'LOADING',
  initialState: {},
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

export const {startLoading, endLoading} = loadingSlice.actions;

export default loadingSlice.reducer;
