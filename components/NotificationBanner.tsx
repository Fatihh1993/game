import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function NotificationBanner({ message }: { message: string | null }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  if (!message) return null;
  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 100,
  },
  text: {
    color: theme.colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
