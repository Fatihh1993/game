import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, ThemeMode } from '../theme';
import { Lang, t } from '../translations';

export default function ThemeSelector({
  onSelect,
  uiLanguage,
}: {
  onSelect: (mode: ThemeMode) => void;
  uiLanguage: Lang;
}) {
  const { theme } = useTheme();
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
        row: { flexDirection: 'row', gap: 20 },
        button: {
          backgroundColor: theme.colors.card,
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
        },
        buttonText: {
          color: theme.colors.text,
          fontSize: 18,
          fontWeight: 'bold',
        },
      }),
    [theme]
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t(uiLanguage, 'selectTheme')}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => onSelect('light')}>
          <Text style={styles.buttonText}>{t(uiLanguage, 'light')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onSelect('dark')}>
          <Text style={styles.buttonText}>{t(uiLanguage, 'dark')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
