import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { Lang, t } from '../translations';
import { auth } from '../systems/auth';
import { fetchUserProgress } from '../systems/leaderboard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { countries } from './countries';

export default function ProfileScreen({ onClose, visible, uiLanguage, onShowFriends }: { onClose: () => void, visible: boolean, uiLanguage: Lang, onShowFriends: () => void }) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.displayName) {
      fetchUserProgress(user.displayName).then(setProgress).finally(() => setLoading(false));
      getDoc(doc(db, 'usernames', user.displayName)).then(snap => {
        if (snap.exists()) {
          setCountry(snap.data().country || null);
        }
      });
    }
  }, [user]);

  if (!user) {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.info}>{t(uiLanguage, 'loginRequired')}</Text>
            <TouchableOpacity style={styles.closeButtonBox} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeButtonText}>{t(uiLanguage, 'close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  if (loading) {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <ActivityIndicator color={theme.colors.accent} size="large" />
          </View>
        </View>
      </Modal>
    );
  }

  let countryObj = countries.find(c => c.code === country);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t(uiLanguage, 'profile')}</Text>
          <View style={styles.userBox}>
            <Text style={styles.username}>{user.displayName}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          {countryObj && (
            <View style={styles.countryBox}>
              <Text style={styles.flag}>{countryObj.flag}</Text>
              <Text style={styles.country}>{countryObj.name}</Text>
            </View>
          )}

          <Text style={styles.section}>{t(uiLanguage, 'languagesLevels')}</Text>
          <View style={styles.progressBox}>
          {Object.entries(progress).length > 0 ? (
            Object.entries(progress).map(([lang, level]) => (
              <View key={lang} style={styles.langCard}>
                <Text style={styles.langName}>{lang.toUpperCase()}</Text>
                <Text style={styles.levels}>
                  {t(uiLanguage, 'countryLevel')}: {Array.isArray(level) ? level.join(', ') : String(level)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.levels}>{t(uiLanguage, 'noProgress')}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.friendButtonBox} onPress={onShowFriends} activeOpacity={0.8}>
          <Text style={styles.closeButtonText}>{t(uiLanguage, 'friends')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButtonBox} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeButtonText}>{t(uiLanguage, 'close')}</Text>
        </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  userBox: {
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
  },
  email: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 1,
  },
  countryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 6,
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  country: {
    fontSize: 14,
    color: theme.colors.text,
  },
  section: {
    fontSize: 15,
    color: theme.colors.accent,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  progressBox: {
    width: '100%',
    marginTop: 2,
  },
  langCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 7,
    padding: 6,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langName: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 13,
  },
  levels: {
    color: theme.colors.accent,
    fontSize: 12,
  },
  friendButtonBox: {
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
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
  info: {
    color: '#bbb',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 8,
  },
});
