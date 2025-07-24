import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { updateProfile } from 'firebase/auth';
import { useTheme } from '../theme';
import { Lang, t } from '../translations';
import { auth } from '../systems/auth';
import { fetchUserProgress } from '../systems/leaderboard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { countries } from './countries';

export default function ProfileScreen({ onClose, visible, uiLanguage, onShowFriends }: { onClose: () => void, visible: boolean, uiLanguage: Lang, onShowFriends: () => void }) {
  const { theme } = useTheme();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string | null>(null);
  const user = auth.currentUser;
  const [photo, setPhoto] = useState<string | null>(user?.photoURL ?? null);

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

  const handlePickPhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri && user) {
          setPhoto(uri);
          try {
            await updateProfile(user, { photoURL: uri });
          } catch (e) {
            console.log('Failed to update profile photo', e);
          }
        }
      }
    });
  };

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
          borderRadius: 20,
          padding: 24,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        },
        title: {
          fontSize: 22,
          fontWeight: 'bold',
          color: theme.colors.accent,
          marginBottom: 8,
          letterSpacing: 0.5,
          fontFamily: theme.fontFamily,
        },
        userBox: { alignItems: 'center', marginBottom: 4 },
        username: {
          fontSize: 17,
          fontWeight: '600',
          color: theme.colors.text,
          fontFamily: theme.fontFamily,
        },
        email: {
          fontSize: 13,
          color: '#bbb',
          marginTop: 1,
          fontFamily: theme.fontFamily,
        },
        countryBox: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.card,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 4,
          marginVertical: 6,
        },
        flag: { fontSize: 18, marginRight: 6, fontFamily: theme.fontFamily },
        country: {
          fontSize: 14,
          color: theme.colors.text,
          fontFamily: theme.fontFamily,
        },
        section: {
          fontSize: 15,
          color: theme.colors.accent,
          fontWeight: 'bold',
          marginTop: 14,
          marginBottom: 4,
          alignSelf: 'flex-start',
          fontFamily: theme.fontFamily,
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
        langName: {
          color: theme.colors.text,
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: theme.fontFamily,
        },
        levels: {
          color: theme.colors.accent,
          fontSize: 12,
          fontFamily: theme.fontFamily,
        },
        avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
        photoButton: {
          backgroundColor: theme.colors.primary,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginBottom: 8,
        },
        photoButtonText: {
          color: theme.colors.text,
          fontWeight: 'bold',
          fontFamily: theme.fontFamily,
        },
        badgesBox: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
        badge: {
          backgroundColor: theme.colors.primary,
          color: theme.colors.text,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 8,
          marginRight: 4,
          marginBottom: 4,
          fontSize: 12,
          fontFamily: theme.fontFamily,
        },
        friendButtonBox: {
          marginTop: 12,
          width: '100%',
          alignItems: 'center',
          backgroundColor: theme.colors.primary,
          borderRadius: 12,
        },
        closeButtonBox: {
          marginTop: 14,
          width: '100%',
          alignItems: 'center',
          backgroundColor: theme.colors.primary,
          borderRadius: 12,
        },
        closeButtonText: {
          color: theme.colors.text,
          fontWeight: 'bold',
          fontSize: 15,
          paddingVertical: 7,
          paddingHorizontal: 0,
          textAlign: 'center',
          width: '100%',
          fontFamily: theme.fontFamily,
        },
        info: {
          color: '#bbb',
          fontSize: 15,
          textAlign: 'center',
          marginVertical: 8,
          fontFamily: theme.fontFamily,
        },
      }),
    [theme]
  );

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
          <Image
            source={photo ? { uri: photo } : require('../assets/default-avatar.png.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.photoButton} onPress={handlePickPhoto} activeOpacity={0.7}>
            <Text style={styles.photoButtonText}>
              {photo ? t(uiLanguage, 'changePhoto') : t(uiLanguage, 'uploadPhoto')}
            </Text>
          </TouchableOpacity>
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

