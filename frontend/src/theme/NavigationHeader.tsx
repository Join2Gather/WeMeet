import React from 'react';
import type {FC, ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from './navigation';
import type {StyleProp, ViewStyle, TextStyle} from 'react-native';

export type NavigationHeaderProps = {
  title?: string;
  Left?: () => ReactNode;
  Right?: () => ReactNode;
  viewStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export const NavigationHeader: FC<NavigationHeaderProps> = ({
  title,
  Left,
  Right,
  viewStyle,
  titleStyle,
}) => {
  return (
    <View style={[styles.view, viewStyle]}>
      {Left && Left()}
      <View style={styles.flex}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
      {Right && Right()}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {fontSize: 20, fontWeight: '500', textAlign: 'center'},
  flex: {flex: 1, backgroundColor: 'transparent'},
});
