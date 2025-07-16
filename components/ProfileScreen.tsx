import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { auth } from '../systems/auth';
import { fetchUserProgress } from '../systems/leaderboard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { countries } from './countries';
import { badges } from './badges';

export default function ProfileScreen({ onClose, visible }: { onClose: () => void, visible: boolean }) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string | null>(null);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.displayName) {
      fetchUserProgress(user.displayName).then(setProgress).finally(() => setLoading(false));
      getDoc(doc(db, 'usernames', user.displayName)).then(snap => {
        if (snap.exists()) {
          setCountry(snap.data().country || null);
          setUserBadges(snap.data().badges || []);
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
            <Text style={styles.info}>Giriş yapmalısınız.</Text>
            <TouchableOpacity style={styles.closeButtonBox} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.closeButtonText}>Kapat</Text>
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
            <ActivityIndicator color="#61dafb" size="large" />
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
          <Text style={styles.title}>Profil</Text>
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

          <Text style={styles.section}>Rozetler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
            {userBadges.length > 0 ? badges.filter(b => userBadges.includes(b.id)).map(badge => (
              <View key={badge.id} style={styles.badgeCard}>
                <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            )) : (
              <Text style={styles.info}>Henüz rozetiniz yok.</Text>
            )}
          </ScrollView>

          <Text style={styles.section}>Diller & Seviyeler</Text>
          <View style={styles.progressBox}>
            {progress && Object.keys(progress).length > 0 ? (
              Object.entries(progress).map(([lang, levels]: any) => (
                <View key={lang} style={styles.langCard}>
                  <Text style={styles.langName}>{lang.toUpperCase()}</Text>
                  <Text style={styles.levels}>Seviye: {levels.join(', ')}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.info}>Henüz ilerleme yok.</Text>
            )}
          </View>
          <TouchableOpacity style={styles.closeButtonBox} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,20,30,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    backgroundColor: '#181d23',
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
    color: '#00bfff',
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
    color: '#fff',
  },
  email: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 1,
  },
  countryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222b36',
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
    color: '#fff',
  },
  section: {
    fontSize: 15,
    color: '#00bfff',
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  badgeScroll: {
    minHeight: 44,
    maxHeight: 60,
    marginBottom: 4,
  },
  badgeCard: {
    backgroundColor: '#222b36',
    borderRadius: 8,
    padding: 7,
    marginRight: 7,
    alignItems: 'center',
    minWidth: 44,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeName: {
    fontSize: 11,
    color: '#fff',
    marginTop: 1,
  },
  info: {
    color: '#bbb',
    fontSize: 12,
    marginVertical: 4,
  },
  progressBox: {
    width: '100%',
    marginTop: 2,
  },
  langCard: {
    backgroundColor: '#222b36',
    borderRadius: 7,
    padding: 6,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  levels: {
    color: '#00bfff',
    fontSize: 12,
  },
  closeButtonBox: {
    marginTop: 14,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#00bfff',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 7,
    paddingHorizontal: 0,
    textAlign: 'center',
    width: '100%',
  },
});
