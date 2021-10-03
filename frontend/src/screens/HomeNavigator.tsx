import React, { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useNavigationHorizontalInterpolator } from '../hooks';
import TeamList from './TeamList';
import TeamTime from './TeamTime';
import HomeRight from './HomeRight';

const Stack = createStackNavigator();

export default function MainNavigator() {
	const interpolator = useNavigationHorizontalInterpolator();
	const leftOptions = useMemo<StackNavigationOptions>(
		() => ({
			gestureDirection: 'horizontal-inverted',
			cardStyleInterpolator: interpolator,
		}),
		[]
	);
	const rightOptions = useMemo<StackNavigationOptions>(
		() => ({
			gestureDirection: 'horizontal',
			cardStyleInterpolator: interpolator,
		}),
		[]
	);
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="TeamList" component={TeamList} />
			<Stack.Screen
				name="TeamTime"
				component={TeamTime}
				options={leftOptions}
			/>
			<Stack.Screen
				name="HomeRight"
				component={HomeRight}
				options={rightOptions}
			/>
		</Stack.Navigator>
	);
}
