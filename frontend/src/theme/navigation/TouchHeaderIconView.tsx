import React from 'react';
import type { FC } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from './View';
import type { ViewProps } from './View';
import { Colors } from 'react-native-paper';

type TouchableViewProps = ViewProps & {
	onPress?: () => void;
	underlayColor: string;
	touchableStyle?: StyleProp<ViewStyle>;
};

export const TouchHeaderIconView: FC<TouchableViewProps> = ({
	children,
	onPress,
	underlayColor,
	touchableStyle,

	...viewProps
}) => {
	return (
		<TouchableHighlight
			onPress={onPress}
			underlayColor={underlayColor}
			style={[styles.touchable]}
		>
			<View style={{ backgroundColor: 'transparent' }} {...viewProps}>
				{children}
			</View>
		</TouchableHighlight>
	);
};
const styles = StyleSheet.create({
	touchable: {
		width: 40,
		height: 40,
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
