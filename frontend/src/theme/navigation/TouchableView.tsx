import React from 'react';
import type {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {View} from './View';
import type {ViewProps} from './View';

export type TouchableViewProps = ViewProps & {
  onPress?: () => void;
  touchableStyle?: StyleProp<ViewStyle>;
};

export const TouchableView: FC<TouchableViewProps> = ({
  children,
  onPress,
  touchableStyle,
  ...viewProps
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.touchable, touchableStyle]}>
      <View {...viewProps}>{children}</View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  touchable: {width: '100%', alignItems: 'center', justifyContent: 'center'},
});
