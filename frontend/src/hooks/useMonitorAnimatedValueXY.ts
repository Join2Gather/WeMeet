import {useState, useEffect} from 'react';
import {Animated} from 'react-native';

export type XY = {x: number; y: number};

export const useMonitorAnimatedValueXY = (animValueXY: Animated.ValueXY) => {
  const [realAnimValueXY, setRealAnimValueXY] = useState<XY>({x: 0, y: 0});
  useEffect(() => {
    const id = animValueXY.addListener((value: XY) => {
      setRealAnimValueXY(value);
    });
    return () => animValueXY.removeListener(id);
  }, []);
  return realAnimValueXY;
};
