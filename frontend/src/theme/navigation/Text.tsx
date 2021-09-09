import React from 'react';
import type { FC, ComponentProps } from 'react';
import { StyleSheet, Text as RNText } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Colors } from 'react-native-paper';
import { useIsDarkMode } from '../../hooks';
export type TextProps = ComponentProps<typeof RNText>;

export const Text: FC<TextProps> = ({ style, ...props }) => {
	const { textColor } = useIsDarkMode();
	return <RNText style={[{ color: textColor }, style]} {...props} />;
};

export const UnderlineText: FC<TextProps> = ({ style, ...props }) => {
	const { textColor } = useIsDarkMode();
	return (
		<RNText
			style={[
				styles.underline,
				{
					color: textColor,
					textDecorationColor: textColor,
				},
				style,
			]}
			{...props}
		/>
	);
};
const styles = StyleSheet.create({
	underline: { textDecorationLine: 'underline' },
});
