import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../theme';
import { Lang, t } from '../translations';
import { fetchUserProgress } from '../systems/leaderboard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { countries } from './countries';

export default function UserProfileScreen({ visible, onClose, username, uiLanguage }: { visible: boolean; onClose: () => void; username: string; uiLanguage: Lang }) {
  const { theme } = useTheme();
  const [progress, setProgress] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !username) return;
    setLoading(true);
    Promise.all([
      fetchUserProgress(username).then(setProgress),
      getDoc(doc(db, 'usernames', username)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setEmail(data.email || null);
          setCountry(data.country || null);
          if (data.photoURL) setPhoto(data.photoURL);
        }
      })
    ]).finally(() => setLoading(false));
  }, [username, visible]);

  const countryObj = countries.find(c => c.code === country);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: theme.colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
        },
        card: {
          width: 300,
          backgroundColor: theme.colors.card,
          borderRadius: 18,
          padding: 20,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 10,
          elevation: 6,
        },
        title: {
          fontSize: 22,
          fontWeight: 'bold',
          color: theme.colors.accent,
          marginBottom: 8,
          letterSpacing: 0.5,
        },
        userBox: { alignItems: 'center', marginBottom: 4 },
        username: { fontSize: 17, fontWeight: '600', color: theme.colors.text },
        email: { fontSize: 13, color: '#bbb', marginTop: 1 },
        countryBox: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.card,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 2,
          marginVertical: 6,
        },
        flag: { fontSize: 18, marginRight: 6 },
        country: { fontSize: 14, color: theme.colors.text },
        section: {
          fontSize: 15,
          color: theme.colors.accent,
          fontWeight: 'bold',
          marginTop: 14,
          marginBottom: 4,
          alignSelf: 'flex-start',
        },
        progressBox: { width: '100%', marginTop: 2 },
        langCard: {
          backgroundColor: theme.colors.card,
          borderRadius: 7,
          padding: 6,
          marginBottom: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        langName: { color: theme.colors.text, fontWeight: 'bold', fontSize: 13 },
        levels: { color: theme.colors.accent, fontSize: 12 },
        avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
        badgesBox: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
        badge: {
          backgroundColor: theme.colors.primary,
          color: theme.colors.text,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 6,
          marginRight: 4,
          marginBottom: 4,
          fontSize: 12,
        },
        closeButtonBox: {
          marginTop: 14,
          width: '100%',
          alignItems: 'center',
          backgroundColor: theme.colors.primary,
          borderRadius: 8,
        },
        closeButtonText: {
          color: theme.colors.text,
          fontWeight: 'bold',
          fontSize: 15,
          paddingVertical: 7,
          paddingHorizontal: 0,
          textAlign: 'center',
          width: '100%',
        },
      }),
    [theme]
  );

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator color={theme.colors.accent} size="large" />
          ) : (
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
              <Text style={styles.title}>{t(uiLanguage, 'profile')}</Text>
              <Image
                source={photo ? { uri: photo } : require('../assets/default-avatar.png.png')}
                style={styles.avatar}
              />
              <View style={styles.userBox}>
                <Text style={styles.username}>{username}</Text>
                {email && <Text style={styles.email}>{email}</Text>}
              </View>
              {countryObj && (
                <View style={styles.countryBox}>
                  <Text style={styles.flag}>{countryObj.flag}</Text>
                  <Text style={styles.country}>{countryObj.name}</Text>
                </View>
              )}
              <Text style={styles.section}>{t(uiLanguage, 'languagesLevels')}</Text>
              <View style={styles.progressBox}>
                {Object.keys(progress).length > 0 ? (
                  Object.entries(progress).map(([lang, level]) => (
                    <View key={lang} style={styles.langCard}>
                      <Text style={styles.langName}>{(lang as string).toUpperCase()}</Text>
                      <Text style={styles.levels}>
                        {t(uiLanguage, 'countryLevel')}: {Array.isArray(level) ? level.join(', ') : String(level)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.levels}>{t(uiLanguage, 'noProgress')}</Text>
                )}
              </View>
              <Text style={styles.section}>{t(uiLanguage, 'badges')}</Text>
              <View style={styles.badgesBox}>
                {(() => {
                  const total = Object.values(progress).reduce((s: number, l: any) => {
                    const val = Array.isArray(l) ? Math.max(...l) : Number(l);
                    return s + val;
                  }, 0);
                  const b: string[] = [];
                  if (total >= 5) b.push('Beginner');
                  if (total >= 15) b.push('Intermediate');
                  if (total >= 30) b.push('Expert');
                  return b.length > 0 ? b.map(name => (
                    <Text key={name} style={styles.badge}>{name}</Text>
                  )) : <Text style={styles.levels}>{t(uiLanguage, 'noProgress')}</Text>;
                })()}
              </View>
            </ScrollView>
          )}
          <TouchableOpacity style={styles.closeButtonBox} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeButtonText}>{t(uiLanguage, 'close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

