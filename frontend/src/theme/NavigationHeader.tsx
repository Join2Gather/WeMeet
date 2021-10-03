import React from 'react';
import type { FC, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from './navigation';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Colors } from 'react-native-paper';

export type NavigationHeaderProps = {
	title?: string;
	Left?: () => ReactNode;
	Right?: () => ReactNode;
	viewStyle?: StyleProp<ViewStyle>;
	titleStyle?: StyleProp<TextStyle>;
};

export const NavigationHeader: FC<NavigationHeaderProps> = ({
	title,
	Left,
	Right,
	viewStyle,
	titleStyle,
}) => {
	return (
		<View style={[styles.view, viewStyle]}>
			{Left && Left()}
			<View style={styles.flex}>
				<Text style={[styles.title, titleStyle]}>{title}</Text>
			</View>
			{Right && Right()}
		</View>
	);
};

const styles = StyleSheet.create({
	view: {
		width: '100%',
		padding: 9,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#33aafc',
	},
	title: {
		marginTop: 3,
		fontSize: 20,
		fontWeight: '300',
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -2,
		color: '#fff',
	},
	flex: { flex: 1, backgroundColor: 'transparent' },
});
