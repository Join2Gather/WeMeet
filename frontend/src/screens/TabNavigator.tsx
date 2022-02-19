import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeNavigator from './HomeNavigator';
import Home from './Home';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Platform } from 'react-native';
type TabBarIconProps = { focused: boolean; color: string; size: number };

const icons: Record<string, string[]> = {
	Home: ['calendar-check', 'calendar-blank-outline'],
	HomeNavigator: ['account-multiple', 'account-multiple-outline']
};

const screenOptions = ({
	route
}: {
	route: RouteProp<ParamListBase, string>;
}) => {
	const { inThemeColor, teamColor, isInTeamTime } = useSelector(
		({ login, timetable }: RootState) => ({
			inThemeColor: login.inThemeColor,
			teamColor: timetable.color,
			isInTeamTime: timetable.isInTeamTime
		})
	);
	return {
		tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
			const { name } = route;

			const focusedSize = focused ? size + 6 : size;
			const focusedColor = focused
				? name !== 'Home' && isInTeamTime
					? teamColor
					: inThemeColor
				: color;
			const [icon, iconOutline] = icons[name];

			const iconName = focused ? icon : iconOutline;
			return <Icon name={iconName} size={focusedSize} color={focusedColor} />;
		},
		tabBarActiveBackgroundColor: Colors.white,
		tabBarInactiveBackgroundColor: Colors.white,
		tabBarActiveTintColor:
			route.name !== 'Home' && isInTeamTime ? teamColor : inThemeColor,

		innerHeight: 40,
		headerShown: false,
		tabBarStyle: Platform.OS === 'ios' ? { height: 85 } : { height: 50 }
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
					tabBarLabel: '개인 시간표',
					tabBarLabelStyle: {
						fontSize: 11,
						fontFamily: 'NanumSquareBold'
					}
				}}
			/>
			<Tab.Screen
				name="HomeNavigator"
				component={HomeNavigator}
				options={{
					tabBarLabel: '팀 일정',
					tabBarLabelStyle: {
						fontSize: 11,
						fontFamily: 'NanumSquareBold'
					}
				}}
			/>
		</Tab.Navigator>
	);
}
