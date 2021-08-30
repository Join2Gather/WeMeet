import React from 'react';
import type {FC, ComponentProps} from 'react';
import {Text as RNText} from 'react-native';
import {useTheme} from 'react-native-paper';

export type TextProps = ComponentProps<typeof RNText>;

export const Text: FC<TextProps> = ({style, ...props}) => {
  const {colors} = useTheme();
  return <RNText style={[{color: colors.text}, style]} {...props} />;
};
