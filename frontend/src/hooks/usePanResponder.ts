import {useMemo} from 'react';
import {PanResponder} from 'react-native';
// prettier-ignore
import type {GestureResponderEvent, PanResponderGestureState} from 'react-native';
import type {PanResponderCallbacks, PanResponderInstance} from 'react-native';

type Event = GestureResponderEvent;
type State = PanResponderGestureState;

const defaultCallback = {
  onStartShouldSetPanResponder: (e: Event, s: State) => true,
  onMoveShouldSetPanResponder: (e: Event, s: State) => true,
};

export const usePanResponder = (
  callbacks: PanResponderCallbacks,
  deps: any[] = [],
): PanResponderInstance => {
  const panResponder = useMemo<PanResponderInstance>(
    () => PanResponder.create({...defaultCallback, ...callbacks}),
    deps,
  );
  return panResponder;
};
