import React from 'react';
import type {FC, ComponentProps} from 'react';
import {StyleSheet, Text as RNText} from 'react-native';
import {useTheme} from '@react-navigation/native';

export type TextProps = ComponentProps<typeof RNText>;

export const Text: FC<TextProps> = ({style, ...props}) => {
  const {colors} = useTheme();
  return <RNText style={[{color: colors.text}, style]} {...props} />;
};

export const UnderlineText: FC<TextProps> = ({style, ...props}) => {
  const {colors} = useTheme();
  return (
    <RNText
      style={[
        styles.underline,
        {
          color: colors.text,
          textDecorationColor: colors.text,
        },
        style,
      ]}
      {...props}
    />
  );
};
const styles = StyleSheet.create({
  underline: {textDecorationLine: 'underline'},
});
