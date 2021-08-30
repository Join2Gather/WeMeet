import React from 'react';
import type { FC, ComponentProps } from 'react';
import { View as RNView } from 'react-native';
import { useTheme } from '@react-navigation/native';

export type ViewProps = ComponentProps<typeof RNView> & {
	border?: boolean;
	card?: boolean;
	primary?: boolean;
	notification?: boolean;
	blue?: string;
};

export const View: FC<ViewProps> = ({
	border,
	card,
	primary,
	notification,
	style,
	blue,
	...props
}) => {
	const { colors } = useTheme();
	const backgroundColor = card
		? colors.card
		: colors.border
		? primary
			? colors.primary
			: notification
			? colors.border
			: colors.background
		: colors.border;
	const borderColor = border ? colors.border : undefined;
	const borderWidth = border ? 1 : undefined;
	return (
		<RNView
			style={[{ backgroundColor, borderColor, borderWidth }, style]}
			{...props}
		/>
	);
};
