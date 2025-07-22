import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
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
}

const lightTheme: Theme = {
  colors: {
    background: '#f0f2f5',
    card: '#ffffff',
    primary: '#6200ee',
    text: '#212121',
    accent: '#03dac6',
    error: '#b00020',
    success: '#388e3c',
    border: '#e0e0e0',
    overlay: 'rgba(0,0,0,0.5)',
  },
};

const darkTheme: Theme = {
  colors: {
    background: '#121212',
    card: '#1e1e1e',
    primary: '#bb86fc',
    text: '#ffffff',
    accent: '#03dac6',
    error: '#cf6679',
    success: '#4caf50',
    border: '#272727',
    overlay: 'rgba(0,0,0,0.7)',
  },
};

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  mode: 'light',
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then(value => {
      if (value === 'dark' || value === 'light') {
        setMode(value);
      }
    });
  }, []);

  const handleSetMode = (m: ThemeMode) => {
    setMode(m);
    AsyncStorage.setItem('themeMode', m);
  };

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode: handleSetMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
