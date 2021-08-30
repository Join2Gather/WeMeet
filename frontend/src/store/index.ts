import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import counter from './counter';
import calendar from './calendar';
import loading from './loading';
import login, { loginSaga } from './login';
// import storageSession from 'redux-persist/lib/storage/session';
const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['calendar'],
};
const rootReducer = combineReducers({ counter, login, loading, calendar });
export default persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
	yield all([loginSaga()]);
}
