import { useTheme } from '@react-navigation/native';
import { Colors } from 'react-native-paper';

export function useIsDarkMode(): {
	isDark: boolean;
	backgroundColor: string;
	textColor: string;
} {
	const isDark = useTheme().dark;
	const backgroundColor = isDark ? Colors.white : Colors.white;
	const textColor = isDark ? Colors.black : Colors.grey800;

	return { isDark, backgroundColor, textColor };
}
