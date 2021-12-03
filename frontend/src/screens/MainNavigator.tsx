import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './Login';
import TabNavigator from './TabNavigator';
import DrawerContent from './DrawerContent';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { getUserMe } from '../store/login';

const Drawer = createDrawerNavigator();

export default function MainNavigator() {
	const { token, id, user } = useSelector(({ login }: RootState) => ({
		token: login.token,
		id: login.id,
		user: login.user,
	}));
	const dispatch = useDispatch();
	const navigation = useNavigation();
	useEffect(() => {
		if (token) {
			dispatch(getUserMe({ id, token, user }));
			navigation.navigate('TabNavigator');
		}
	}, [token]);
	return (
		<Drawer.Navigator
			screenOptions={{ headerShown: false }}
			drawerContent={(props) => <DrawerContent {...props} />}
		>
			<Drawer.Screen name="Login" component={Login} />
			<Drawer.Screen
				name="TabNavigator"
				component={TabNavigator}
				options={{ title: 'Home' }}
			/>
		</Drawer.Navigator>
	);
}
