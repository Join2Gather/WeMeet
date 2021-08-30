import React from 'react';
// import {ActivityIndicator} from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
// import {
//   PaperThemeDefault,
//   PaperThemeDark,
//   CombinedDefaultTheme,
//   CombinedDarkTheme,
// } from 'app/config/theme-config';
import { applyMiddleware, createStore } from 'redux';
// import {IThemeState} from 'app/models/reducers/theme';
import rootReducer, { rootSaga } from './src/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(sagaMiddleware))
); // 스토어를 만듭니다.
const persistor = persistStore(store);
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useState, useCallback } from 'react';

import MainNavigator from './src/screens/MainNavigator';
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from '@react-navigation/native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToggleThemeProvider } from './src/contexts';

enableScreens();
sagaMiddleware.run(rootSaga);
export default function App() {
	const scheme = useColorScheme();
	const [theme, setTheme] = useState(
		scheme === 'dark' ? DarkTheme : DefaultTheme
	);
	const toggleTheme = useCallback(
		() => setTheme(({ dark }) => (dark ? DefaultTheme : DarkTheme)),
		[]
	);
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AppearanceProvider>
					<ToggleThemeProvider toggleTheme={toggleTheme}>
						<SafeAreaProvider>
							<NavigationContainer theme={theme}>
								<MainNavigator />
							</NavigationContainer>
						</SafeAreaProvider>
					</ToggleThemeProvider>
				</AppearanceProvider>
			</PersistGate>
		</Provider>
	);
}

// const App: React.FC = () => {
// 	return <RootNavigation />;
// };

// export default App;
