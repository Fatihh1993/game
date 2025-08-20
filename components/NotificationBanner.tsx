import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function NotificationBanner({ message }: { message: string | null }) {
  const { theme } = useTheme();
  if (!message) return null;
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          top: 40,
          left: 20,
          right: 20,
          backgroundColor: theme.colors.primary,
          borderRadius: 12,
          paddingVertical: 10,
          paddingHorizontal: 16,
          zIndex: 100,
        },
        text: {
          color: theme.colors.text,
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: theme.fontFamily,
        },
      }),
    [theme]
  );
  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
