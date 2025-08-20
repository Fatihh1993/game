import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { Lang, t } from '../translations';
import { auth } from '../systems/auth';
import { searchUsers, sendFriendRequest, fetchFriendRequests, fetchSentFriendRequests, acceptFriendRequest, fetchFriendsWithProgress } from '../systems/friends';
import UserProfileScreen from './UserProfileScreen';

export default function FriendsScreen({ visible, onClose, uiLanguage }: { visible: boolean; onClose: () => void; uiLanguage: Lang }) {
  const { theme } = useTheme();
  const user = auth.currentUser;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [info, setInfo] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  useEffect(() => {
    if (visible && user?.displayName) {
      fetchFriendRequests(user.displayName).then(setRequests);
      fetchSentFriendRequests(user.displayName).then(reqs => {
        setOutgoingRequests(reqs);
        setSentRequests(reqs.map(r => r.to));
      });
      fetchFriendsWithProgress(user.displayName).then(setFriends);
    }
    if (!visible) setInfo(null);
  }, [visible, user]);

  const handleSearch = async () => {
    setLoading(true);
    const res = await searchUsers(query);
    setResults(res.filter(r => r.username !== user?.displayName));
    setLoading(false);
  };

  const handleAdd = async (name: string) => {
    if (!user?.displayName) return;
    await sendFriendRequest(user.displayName, name);
    setInfo(t(uiLanguage, 'requestSent'));
    setSentRequests(prev => [...prev, name]);
    setOutgoingRequests(prev => [...prev, { from: user.displayName, to: name }]);
    setTimeout(() => setInfo(null), 2000);
  };

  const handleAccept = async (name: string) => {
    if (!user?.displayName) return;
    await acceptFriendRequest(name, user.displayName);
    fetchFriendRequests(user.displayName).then(setRequests);
    fetchFriendsWithProgress(user.displayName).then(setFriends);
    fetchSentFriendRequests(user.displayName).then(reqs => {
      setOutgoingRequests(reqs);
      setSentRequests(reqs.map(r => r.to));
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
          width: 320,
          backgroundColor: theme.colors.card,
          borderRadius: 20,
          padding: 24,
          alignItems: 'center',
        },
        title: {
          color: theme.colors.accent,
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 8,
          fontFamily: theme.fontFamily,
        },
        searchRow: { flexDirection: 'row', marginBottom: 8 },
        input: {
          backgroundColor: theme.colors.card,
          color: theme.colors.text,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingHorizontal: 10,
          paddingVertical: 8,
          flex: 1,
          marginRight: 6,
          fontFamily: theme.fontFamily,
        },
        searchButton: {
          backgroundColor: theme.colors.primary,
          borderRadius: 12,
          paddingHorizontal: 12,
          justifyContent: 'center',
        },
        addButton: {
          backgroundColor: theme.colors.primary,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 6,
        },
        profileButton: {
          backgroundColor: theme.colors.primary,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginLeft: 6,
        },
        buttonText: {
          color: theme.colors.text,
          fontWeight: 'bold',
          fontFamily: theme.fontFamily,
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 4,
          width: '100%',
        },
        name: {
          color: theme.colors.text,
          fontSize: 15,
          flex: 1,
          fontFamily: theme.fontFamily,
        },
        levelText: {
          color: theme.colors.accent,
          fontSize: 12,
          flex: 1,
          textAlign: 'right',
          fontFamily: theme.fontFamily,
        },
        section: {
          alignSelf: 'flex-start',
          marginTop: 10,
          marginBottom: 4,
          color: theme.colors.accent,
          fontWeight: 'bold',
          fontFamily: theme.fontFamily,
        },
        closeButton: {
          marginTop: 12,
          backgroundColor: theme.colors.primary,
          borderRadius: 12,
          paddingVertical: 10,
          paddingHorizontal: 24,
        },
        info: {
          color: theme.colors.success,
          marginBottom: 6,
          fontWeight: 'bold',
          fontFamily: theme.fontFamily,
        },
        sentText: {
          color: theme.colors.accent,
          fontWeight: 'bold',
          fontFamily: theme.fontFamily,
        },
      }),
    [theme]
  );

  return (
    <>
      <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
        <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t(uiLanguage, 'friends')}</Text>
          {info && <Text style={styles.info}>{info}</Text>}
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder={t(uiLanguage, 'searchFriend')}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.7}>
              <Text style={styles.buttonText}>{t(uiLanguage, 'search')}</Text>
            </TouchableOpacity>
          </View>
          {loading && <ActivityIndicator color={theme.colors.accent} style={{ marginVertical: 8 }} />}
          <ScrollView style={{ maxHeight: 100, width: '100%' }}>
            {results.map(r => (
              <View key={r.username} style={styles.row}>
                <Text style={styles.name}>{r.username}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAdd(r.username)}
                  activeOpacity={0.7}
                  disabled={sentRequests.includes(r.username) || friends.some(f => f.username === r.username)}
                >
                  <Text style={styles.buttonText}>
                    {friends.some(f => f.username === r.username)
                      ? t(uiLanguage, 'friend')
                      : sentRequests.includes(r.username)
                      ? t(uiLanguage, 'requestSent')
                      : t(uiLanguage, 'add')}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.section}>{t(uiLanguage, 'pendingRequests')}</Text>
          <ScrollView style={{ maxHeight: 80, width: '100%' }}>
            {requests.map(r => (
              <View key={r.from} style={styles.row}>
                <Text style={styles.name}>{r.from}</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => handleAccept(r.from)} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>{t(uiLanguage, 'accept')}</Text>
                </TouchableOpacity>
              </View>
            ))}
            {outgoingRequests.map(r => (
              <View key={`out_${r.to}`} style={styles.row}>
                <Text style={styles.name}>{r.to}</Text>
                <Text style={styles.sentText}>{t(uiLanguage, 'requestSent')}</Text>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.section}>{t(uiLanguage, 'friends')}</Text>
          <ScrollView style={{ maxHeight: 120, width: '100%' }}>
            {friends.map(f => (
              <View key={f.username} style={styles.row}>
                <Text style={styles.name}>{f.username}</Text>
                <Text style={styles.levelText}>{Object.entries(f.progress).map(([lang, lvl]) => `${lang.toUpperCase()}: ${lvl}`).join(', ')}</Text>
                <TouchableOpacity style={styles.profileButton} onPress={() => setSelectedFriend(f.username)} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>{t(uiLanguage, 'viewProfile')}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{t(uiLanguage, 'close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    {selectedFriend && (
      <UserProfileScreen
        visible={true}
        onClose={() => setSelectedFriend(null)}
        username={selectedFriend}
        uiLanguage={uiLanguage}
      />
    )}
    </>
  );
}

