import React, { createContext, useContext, useMemo, useState } from 'react';
import { Theme, ThemeName, themes } from '../theme';

type ThemeContextValue = {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
  setTheme: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  const value = useMemo(
    () => ({
      theme: themes[themeName],
      themeName,
      toggleTheme: () => setThemeName((prev) => (prev === 'light' ? 'dark' : 'light')),
      setTheme: setThemeName,
    }),
    [themeName]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
