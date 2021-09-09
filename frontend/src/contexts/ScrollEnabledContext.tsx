/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {createContext, useContext, useState} from 'react';
import type {FC} from 'react';

export type ScrollEnabledContextType = {
  scrollEnabled: boolean;
  setScrollEnabled: (enable: boolean) => void;
};

const defaultScrollEnabledContext = {
  scrollEnabled: true,
  setScrollEnabled: (enable: boolean) => {},
};
const ScrollEnabledContext = createContext<ScrollEnabledContextType>(
  defaultScrollEnabledContext,
);
type ScrollEnabledContextProps = {};
export const ScrollEnabledProvider: FC<ScrollEnabledContextProps> = ({
  children,
}) => {
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);
  const value = {
    scrollEnabled,
    setScrollEnabled,
  };
  return (
    <ScrollEnabledContext.Provider value={value}>
      {children}
    </ScrollEnabledContext.Provider>
  );
};
export const useScrollEnabled = (): [boolean, (enabled: boolean) => void] => {
  const {scrollEnabled, setScrollEnabled} = useContext(ScrollEnabledContext);
  return [scrollEnabled, setScrollEnabled];
};
