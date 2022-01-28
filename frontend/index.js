import 'expo-dev-client';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	console.log('Message handled in the background!', remoteMessage);
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
AppRegistry.registerComponent('app', () => App);
registerRootComponent(App);
