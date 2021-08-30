import React, {forwardRef, ForwardRefRenderFunction} from 'react';
import type {ComponentProps} from 'react';
import {TextInput as RNTextInput} from 'react-native';
import {useTheme} from 'react-native-paper';

export type TextInputProps = ComponentProps<typeof RNTextInput>;

const _TextInput: ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
  {style, ...props},
  ref,
) => {
  const {colors} = useTheme();

  return (
    <RNTextInput
      ref={ref}
      style={[{color: colors.text, borderColor: colors.placeholder}, style]}
      {...props}
    />
  );
};

export const TextInput = forwardRef(_TextInput);
