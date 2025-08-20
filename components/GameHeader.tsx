import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme';

interface Props {
  title?: string;
}

export default function GameHeader({ title = 'CodeQuest' }: Props) {
  const { theme } = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 24,
          marginBottom: 12,
        },
        title: {
          fontSize: 28,
          fontWeight: 'bold',
          marginLeft: 8,
          letterSpacing: 2,
          fontFamily: theme.fontFamily,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container}>
      <Icon name="gamepad-variant-outline" size={32} color={theme.colors.accent} />
      <Text style={[styles.title, { color: theme.colors.accent }]}>{title}</Text>
    </View>
  );
}

