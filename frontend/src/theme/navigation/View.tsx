import React from 'react';
import type { FC, ComponentProps } from 'react';
import { View as RNView } from 'react-native';
import { useIsDarkMode } from '../../hooks';

export type ViewProps = ComponentProps<typeof RNView> & {
	border?: boolean;
	card?: boolean;
	primary?: boolean;
	notification?: boolean;
};

export const View: FC<ViewProps> = ({
	border,
	card,
	primary,
	notification,
	style,
	...props
}) => {
	const { backgroundColor } = useIsDarkMode();

	const borderColor = border ? backgroundColor : undefined;
	const borderWidth = border ? 1 : undefined;
	return (
		<RNView
			style={[{ backgroundColor, borderColor, borderWidth }, style]}
			{...props}
		/>
	);
};
