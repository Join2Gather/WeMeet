import React from 'react';
import type { FC, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from './navigation';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Colors } from 'react-native-paper';

export type NavigationHeaderProps = {
	title: string;
	Left?: () => ReactNode;
	Right?: () => ReactNode;
	secondRight?: () => ReactNode;
	thirdRight?: () => ReactNode;
	headerColor?: string;
	viewStyle?: StyleProp<ViewStyle>;
	titleStyle?: StyleProp<TextStyle>;
};

export const NavigationHeader: FC<NavigationHeaderProps> = ({
	title,
	Left,
	Right,
	secondRight,
	thirdRight,
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
			{/* <View style={{ flex: 0.01, backgroundColor: 'transparent' }}></View> */}
			<View style={styles.halfFlex}>{Left && Left()}</View>
			<View style={[styles.flex]}>
				<Text
					style={[styles.title, titleStyle]}
					numberOfLines={title && title?.length > 7 ? 3 : 2}
					ellipsizeMode="tail"
				>
					{title}
					{console.log('len', title?.length)}
				</Text>
			</View>
			<View
				style={[
					styles.halfFlex,
					{ flexDirection: 'row', justifyContent: 'flex-end' },
				]}
			>
				{thirdRight && thirdRight()}
				<View style={{ flex: 0.3, backgroundColor: 'transparent' }}></View>
				{secondRight && secondRight()}
				<View style={{ flex: 0.3, backgroundColor: 'transparent' }}></View>
				{Right && Right()}
			</View>
			{/* <View style={{ flex: 0.01, backgroundColor: 'transparent' }}></View> */}
		</View>
	);
};

const styles = StyleSheet.create({
	flex: {
		flex: 0.6,
		backgroundColor: 'transparent',
	},
	halfFlex: {
		flex: 0.5,
		backgroundColor: 'transparent',
	},
	view: {
		width: '100%',
		padding: 9,
		flexDirection: 'row',
		alignItems: 'center',

		backgroundColor: '#33aafc',
		borderBottomEndRadius: 15,
		borderBottomLeftRadius: 15,
		height: 55,
	},
	title: {
		fontSize: 18,
		fontWeight: '300',
		textAlign: 'center',

		fontFamily: 'NanumSquareBold',
		letterSpacing: -2,
		color: '#fff',
	},
	// flex: { flex: 1, backgroundColor: 'transparent' },
});
