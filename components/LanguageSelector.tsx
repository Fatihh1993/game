import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { Lang, t } from '../translations';

export const LanguageSelector = ({
  onSelect,
  uiLanguage,
}: {
  onSelect: (lang: string) => void;
  uiLanguage: Lang;

}) => {
  const { theme } = useTheme();
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

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        },
        title: {
          color: theme.colors.accent,
          fontSize: 24,
          marginBottom: 30,
          fontWeight: 'bold',
          textAlign: 'center',
        },
        buttonGrid: {
          gap: 20,
        },
        buttonRow: {
          flexDirection: 'column',
          justifyContent: 'center',
          marginBottom: 10,
          gap: 20,
          alignItems: 'center',
        },
        button: {
          backgroundColor: theme.colors.card,
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          marginHorizontal: 10,
        },
        readyButton: {
          backgroundColor: theme.colors.primary,
          paddingVertical: 16,
          paddingHorizontal: 48,
          borderRadius: 12,
          marginTop: 20,
        },
        buttonText: {
          color: theme.colors.text,
          fontSize: 18,
          fontWeight: 'bold',
        },
        levelLocked: {
          opacity: 0.5,
        },
        row: { flexDirection: 'row', gap: 20, marginBottom: 20 },
      }),
    [theme]
  );

  if (showReady && language) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.title}>{t(uiLanguage, 'ready')}</Text>
        <TouchableOpacity style={styles.readyButton} onPress={handleStart}>
          <Text style={styles.buttonText}>{t(uiLanguage, 'yes')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
      
    </View>
  );
};
