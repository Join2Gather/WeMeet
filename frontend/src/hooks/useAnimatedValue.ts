import {useRef} from 'react';
import {Animated} from 'react-native';

export const useAnimatedValue = (initValue: number = 0): Animated.Value => {
  return useRef(new Animated.Value(initValue)).current;
};
