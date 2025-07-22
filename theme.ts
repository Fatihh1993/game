import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = {
  colors: {
    background: string;
    card: string;
    primary: string;
    text: string;
    accent: string;
    error: string;
    success: string;
    border: string;
    overlay: string;
  };
};

export const lightTheme: Theme = {
  colors: {
    background: '#f2f2f2',
    card: '#ffffff',
    primary: '#0A84FF',
    text: '#000000',
    accent: '#007aff',
    error: '#FF453A',
    success: '#32D74B',
    border: '#d0d0d0',
    overlay: 'rgba(255,255,255,0.8)',
  },
};

export const darkTheme: Theme = {
  colors: {
    background: '#121212',
    card: '#1f1f1f',
    primary: '#0A84FF',
    text: '#FFFFFF',
    accent: '#64D2FF',
    error: '#FF453A',
    success: '#32D74B',
    border: '#2c2c2e',
    overlay: 'rgba(0,0,0,0.7)',
  },
};

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: darkTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(darkTheme);
  const toggleTheme = () =>
    setTheme((t) => (t === darkTheme ? lightTheme : darkTheme));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
