import React from 'react';
import type {FC, ComponentProps} from 'react';
import {TouchableOpacity, View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';

type TouchableOpacityProps = ComponentProps<typeof TouchableOpacity>;
export type TouchableViewProps = TouchableOpacityProps & {
  viewStyle?: StyleProp<ViewStyle>;
};
// prettier-ignore
export const TouchableView: FC<TouchableViewProps> = ({
  children, viewStyle, ...touchableProps}) => {
  return (
    <TouchableOpacity {...touchableProps}>
      <View style={[viewStyle]}>{children}</View>
    </TouchableOpacity>
  );
};
