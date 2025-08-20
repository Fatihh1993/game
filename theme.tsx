import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'retro';

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
  fontFamily: string;
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
  fontFamily: 'System',
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
  fontFamily: 'System',
};

const retroTheme: Theme = {
  colors: {
    background: '#0d1b2a',
    card: '#1b263b',
    primary: '#e0e1dd',
    text: '#e0e1dd',
    accent: '#ffb703',
    error: '#ef233c',
    success: '#06d6a0',
    border: '#415a77',
    overlay: 'rgba(0,0,0,0.7)',
  },
  fontFamily: 'Courier New',
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
      if (value === 'dark' || value === 'light' || value === 'retro') {
        setMode(value as ThemeMode);
      }
    });
  }, []);

  const handleSetMode = (m: ThemeMode) => {
    setMode(m);
    AsyncStorage.setItem('themeMode', m);
  };

  const theme =
    mode === 'dark' ? darkTheme : mode === 'retro' ? retroTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode: handleSetMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
