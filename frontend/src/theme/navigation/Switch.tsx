import React from 'react';
import type { FC, ComponentProps } from 'react';
import { Switch as RNSwitch } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useToggleTheme } from '../../contexts';

export type SwitchProps = ComponentProps<typeof RNSwitch>;

export const Switch: FC<SwitchProps> = (props) => {
	const theme = useTheme();
	const toggleTheme = useToggleTheme();
	return <RNSwitch {...props} value={theme.dark} onValueChange={toggleTheme} />;
};
