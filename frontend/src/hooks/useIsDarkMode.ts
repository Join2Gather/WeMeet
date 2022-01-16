import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Colors } from 'react-native-paper';

import { useColorScheme } from 'react-native-appearance';
export function useIsDarkMode(): {
	isDark: boolean;
	backgroundColor: string;
	textColor: string;
} {
	const isDark = useColorScheme() === 'dark' ? true : false;

	const backgroundColor = isDark ? Colors.white : Colors.white;
	const textColor = isDark ? Colors.grey800 : Colors.grey800;

	return { isDark, backgroundColor, textColor };
}
