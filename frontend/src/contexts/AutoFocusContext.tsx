/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {createContext, useContext, useRef, useCallback} from 'react';
import type {FC, ComponentProps} from 'react';
import {findNodeHandle} from 'react-native';
import type {NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;
export type AutoFocusContextType = {
  autoFocus: (event: FocusEvent) => void;
};
const defaultAutoFocusContext = {
  autoFocus: (event: FocusEvent) => {},
};
const AutoFocusContext = createContext<AutoFocusContextType>(
  defaultAutoFocusContext,
);

export type AutoFocusProviderProps = ComponentProps<
  typeof KeyboardAwareScrollView
>;
export const AutoFocusProvider: FC<AutoFocusProviderProps> = ({
  children,
  ...props
}) => {
  const scrollRef = useRef<KeyboardAwareScrollView | null>(null);
  const scrollToInput = useCallback((reactNode: any) => {
    scrollRef.current?.scrollToFocusedInput(reactNode);
  }, []);
  const autoFocus = useCallback((event: FocusEvent) => {
    scrollToInput(findNodeHandle(event.target));
  }, []);
  const value = {
    autoFocus,
  };

  return (
    <AutoFocusContext.Provider value={value}>
      <KeyboardAwareScrollView
        {...props}
        style={{flex: 1, width: '100%'}}
        ref={scrollRef}>
        {children}
      </KeyboardAwareScrollView>
    </AutoFocusContext.Provider>
  );
};

export const useAutoFocus = () => {
  const {autoFocus} = useContext(AutoFocusContext);
  return autoFocus;
};
