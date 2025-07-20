import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Lang, t } from '../translations';

export const LanguageSelector = ({
  onSelect,
  uiLanguage,
  theme,
  onThemeChange,
}: {
  onSelect: (lang: string) => void;
  uiLanguage: Lang;
  theme: 'light' | 'dark';
  onThemeChange: (t: 'light' | 'dark') => void;
}) => {
  const [language, setLanguage] = useState<string | null>(null);
  const [showReady, setShowReady] = useState(false);

  const handleLanguage = (lang: string) => {
    setLanguage(lang);
    setShowReady(true);
  };

  const handleStart = () => {
    if (language) {
      onSelect(language);
    }
  };

  if (showReady && language) {
    return (
      <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e' }]}>
        <Text style={styles.title}>{t(uiLanguage, 'ready')}</Text>
        <TouchableOpacity style={styles.readyButton} onPress={handleStart}>
          <Text style={styles.buttonText}>{t(uiLanguage, 'yes')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e' }]}>
      <Text style={styles.title}>{t(uiLanguage, 'selectLanguage')}</Text>
      <View style={styles.buttonGrid}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleLanguage('csharp')}>
            <Text style={styles.buttonText}>C#</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleLanguage('sql')}>
            <Text style={styles.buttonText}>SQL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleLanguage('javascript')}>
            <Text style={styles.buttonText}>JavaScript</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleLanguage('python')}>
            <Text style={styles.buttonText}>Python</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.buttonRow, { marginTop: 20 }]}> 
        <Text style={[styles.title, { marginBottom: 10 }]}>{t(uiLanguage, 'selectTheme')}</Text>
        <TouchableOpacity style={styles.button} onPress={() => onThemeChange('light')}>
          <Text style={styles.buttonText}>{t(uiLanguage, 'light')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onThemeChange('dark')}>
          <Text style={styles.buttonText}>{t(uiLanguage, 'dark')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#61dafb',
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonGrid: {
    gap: 20,
  },
  buttonRow: {
    flexDirection: 'column', // alt alta
    justifyContent: 'center',
    marginBottom: 10,
    gap: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#282c34',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  readyButton: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelLocked: {
    opacity: 0.5,
  },
});
