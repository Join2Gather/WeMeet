import React, {createContext, FC, useContext} from 'react';

export type ToggleThemeContextType = {
  toggleTheme: () => void;
};
const defaultToggleThemeContext = {
  toggleTheme: () => {},
};

const ToggleThemeContext = createContext<ToggleThemeContextType>(
  defaultToggleThemeContext,
);

type ToggleThemeContextProps = {
  toggleTheme: () => void;
};
export const ToggleThemeProvider: FC<ToggleThemeContextProps> = ({
  children,
  toggleTheme,
}) => {
  const value = {toggleTheme};
  return (
    <ToggleThemeContext.Provider value={value}>
      {children}
    </ToggleThemeContext.Provider>
  );
};

export const useToggleTheme = () => {
  const {toggleTheme} = useContext(ToggleThemeContext);
  return toggleTheme;
};
