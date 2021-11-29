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
	secondRight?: () => ReactNode;
	headerColor?: string;
	viewStyle?: StyleProp<ViewStyle>;
	titleStyle?: StyleProp<TextStyle>;
};

export const NavigationHeader: FC<NavigationHeaderProps> = ({
	title,
	Left,
	Right,
	secondRight,
	viewStyle,
	titleStyle,
	headerColor,
}) => {
	return (
		<View
			style={[
				styles.view,
				viewStyle,
				{ backgroundColor: headerColor ? headerColor : '#33aafc' },
			]}
		>
			<View style={styles.flex}>{Left && Left()}</View>

			<View style={styles.flex}>
				<Text style={[styles.title, titleStyle]}>{title}</Text>
			</View>
			<View
				style={[
					styles.flex,
					{ flexDirection: 'row', justifyContent: 'flex-end' },
				]}
			>
				{secondRight && secondRight()}
				<View style={{ flex: 0.2, backgroundColor: 'transparent' }}></View>
				{Right && Right()}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	flex: { flex: 1, backgroundColor: 'transparent' },
	view: {
		width: '100%',
		padding: 9,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		backgroundColor: '#33aafc',
		height: 45,
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
	// flex: { flex: 1, backgroundColor: 'transparent' },
});
