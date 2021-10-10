import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import sample, { sampleSaga } from './sample';
import loading from './loading';
import login from './login';
import team, { teamSaga } from './team';
import individual, { individualSaga } from './individual';
// import storageSession from 'redux-persist/lib/storage/session';
const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['login', 'individual', 'team'],
};
const rootReducer = combineReducers({ loading, login, team, individual });
export default persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
	yield all([teamSaga(), individualSaga()]);
}
