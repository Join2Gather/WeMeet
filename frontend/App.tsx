import React from 'react';
// import {ActivityIndicator} from 'react-native';
import {Provider, useSelector} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {composeWithDevTools} from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
// import {
//   PaperThemeDefault,
//   PaperThemeDark,
//   CombinedDefaultTheme,
//   CombinedDarkTheme,
// } from 'app/config/theme-config';
import {applyMiddleware, createStore} from 'redux';
// import {IThemeState} from 'app/models/reducers/theme';
import rootReducer, {rootSaga} from './src/store';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
); // 스토어를 만듭니다.
const persistor = persistStore(store);
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/Home';
import CounterScreen from './src/screens/Counter';
import GithubScreen from './src/screens/Github';
import ToggleScreen from './src/screens/Toggle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const Tab = createBottomTabNavigator();

// interface IState {
//   themeReducer: IThemeState;
// }

const RootNavigation: React.FC = () => {
  // const isDark = useSelector((state: IState) => state.themeReducer.isDark);
  // const paperTheme = isDark ? PaperThemeDark : PaperThemeDefault;
  // const combinedTheme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName = '';

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'Counter') {
                iconName = 'terminal';
              } else if (route.name === 'Github') {
                iconName = 'github';
              }

              // You can return any component that you like here!
              return <FontAwesome name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Counter" component={CounterScreen} />
          <Tab.Screen name="Github" component={GithubScreen} />
          <Tab.Screen name="Toggle" component={ToggleScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};
sagaMiddleware.run(rootSaga);
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigation />
      </PersistGate>
    </Provider>
  );
};

export default App;
