import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Lang } from '../translations';

type Props = {
  score: number;
  lives: number;
  bestScore: number;
  streak: number;
  bestStreak: number;
  xp: number;
  level: number;
  theme: any;
  t: (lang: Lang, key: string) => string;
  uiLanguage: Lang;
};

const stats = [
  { icon: 'star', key: 'score', color: '#FFD700' },
  { icon: 'heart', key: 'lives', color: '#FF4D4D' },
  { icon: 'trophy', key: 'best', color: '#00E676' },
  { icon: 'repeat', key: 'streak', color: '#00B0FF' },
  { icon: 'fire', key: 'bestStreak', color: '#FF9100' },
  { icon: 'star-circle', key: 'xp', color: '#FFD700' },
  { icon: 'account-arrow-up', key: 'level', color: '#B388FF' },
];

export default function GameStats(props: Props) {
  const { score, lives, bestScore, streak, bestStreak, xp, level, theme, t, uiLanguage } = props;
  const values: any = { score, lives, best: bestScore, streak, bestStreak, xp: `${xp}/100`, level };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          borderRadius: 16,
          padding: 8,
          margin: 8,
          elevation: 3,
        },
        statCard: {
          alignItems: 'center',
          margin: 8,
          minWidth: 60,
        },
        statValue: {
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 2,
          fontFamily: theme.fontFamily,
        },
        statLabel: {
          fontSize: 12,
          marginTop: 1,
          fontWeight: '600',
          fontFamily: theme.fontFamily,
        },
      }),
    [theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {stats.map(stat => (
        <View style={styles.statCard} key={stat.key}>
          <Icon name={stat.icon} size={22} color={stat.color} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {values[stat.key]}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.accent }]}>
            {t(uiLanguage, stat.key)}
          </Text>
        </View>
      ))}
    </View>
  );
}