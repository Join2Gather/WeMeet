import React from 'react';
import {
	createBottomTabNavigator,
	BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeNavigator from './HomeNavigator';
import Home from './Home';
import TeamList from './TeamList';
import type { RouteProp, ParamListBase } from '@react-navigation/native';

type TabBarIconProps = { focused: boolean; color: string; size: number };

const icons: Record<string, string[]> = {
	Home: ['calendar-check', 'calendar-blank-outline'],
	HomeNavigator: ['account-multiple', 'account-multiple-outline'],
};

const screenOptions = ({
	route,
}: {
	route: RouteProp<ParamListBase, string>;
}) => {
	return {
		tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
			const { name } = route;
			const focusedSize = focused ? size + 6 : size;
			const focusedColor = focused ? Colors.lightBlue500 : color;
			const [icon, iconOutline] = icons[name];
			const iconName = focused ? icon : iconOutline;
			return <Icon name={iconName} size={focusedSize} color={focusedColor} />;
		},
		tabBarActiveBackgroundColor: Colors.white,
		tabBarInactiveBackgroundColor: Colors.white,
		headerShown: false,
	};
};
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
	return (
		<Tab.Navigator screenOptions={screenOptions}>
			<Tab.Screen
				name="Home"
				component={Home}
				options={{
					tabBarLabel: 'Home',
				}}
			/>
			<Tab.Screen
				name="HomeNavigator"
				component={HomeNavigator}
				options={{ tabBarLabel: 'Team' }}
			/>
		</Tab.Navigator>
	);
}
