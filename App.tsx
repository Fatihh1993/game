import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from './theme';
import { GameEngine } from 'react-native-game-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageSelector } from './components/LanguageSelector';
import { hackSystem } from './systems/hack';
import { fetchSnippets } from './systems/fetchSnippets';
import AuthScreen from './components/AuthScreen';
import { auth } from './systems/auth';
import {
  fetchLeaderboard,
  submitScore,
  saveUserProgress,
  fetchUserProgress,
} from './systems/leaderboard';
import ProfileScreen from './components/ProfileScreen';
import FriendsScreen from './components/FriendsScreen';
import NotificationBanner from './components/NotificationBanner';
import { Lang, t } from './translations';
import { subscribeFriendRequests } from './systems/friends';
import GameStats from './components/GameStats';

export default function App() {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [uiLanguage, setUiLanguage] = useState<Lang>('tr');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loadingSnippets, setLoadingSnippets] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [savingScore, setSavingScore] = useState(false);
  const [lbError, setLbError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const gameEngineRef = useRef<any>(null);
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    AsyncStorage.getItem('bestScore').then(value => {
      if (value) setBestScore(parseInt(value));
    });
    AsyncStorage.getItem('bestStreak').then(value => {
      if (value) setBestStreak(parseInt(value));
    });
  }, []);

  // Kullanıcıyı dinle (oturum açık mı?)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user?.displayName) {
      const unsub = subscribeFriendRequests(
        user.displayName,
        setPendingRequests,
      );
      return unsub;
    }
  }, [user]);

  useEffect(() => {
    if (pendingRequests.length > 0) {
      setNotification(
        `${t(uiLanguage, 'friendRequestFrom')} ${pendingRequests[0].from}`,
      );
    } else {
      setNotification(null);
    }
  }, [pendingRequests, uiLanguage]);

  // Oyun bittiğinde skor kaydet ve leaderboard'ı getir
  useEffect(() => {
    if (gameOver && user && selectedLanguage) {
      setSavingScore(true);
      const username =
        user.displayName || user.email || t(uiLanguage, 'usernameLabel');
      submitScore(username, score, selectedLanguage)
        .then(() => fetchLeaderboard(selectedLanguage).then(setLeaderboard))
        .catch(() => setLbError(t(uiLanguage, 'genericError')))
        .finally(() => setSavingScore(false));
      if (level) {
        saveUserProgress(username, selectedLanguage, level);
      }
    }
  }, [gameOver, user, selectedLanguage, level]);

  const handleAnswer = async (
    isCorrect: boolean | null,
    isGold: boolean,
    id: string,
  ) => {
    if (isCorrect === null) return;
    const isRight = isCorrect === true;
    setScore(prev => prev + (isRight ? 1 : 0));
    if (isRight) {
      setStreak(prev => prev + 1);
      const gained = isGold ? 20 : 10;
      setXp(prevXp => {
        const total = prevXp + gained;
        const levelUps = Math.floor(total / 100);
        if (levelUps > 0) {
          setLevel(l => l + levelUps);
        }
        return total % 100;
      });
    } else {
      setStreak(0);
    }
    if (!isRight) {
      setLives(prev => {
        if (prev - 1 <= 0) {
          setGameOver(true);
          checkBestScore();
          return 0;
        }
        return prev - 1;
      });
    }
    gameEngineRef.current.dispatch({ type: 'REMOVE_SNIPPET', id });
  };

  const checkBestScore = async () => {
    if (score > bestScore) {
      setBestScore(score);
      await AsyncStorage.setItem('bestScore', score.toString());
    }
  };

  useEffect(() => {
    if (streak > bestStreak) {
      setBestStreak(streak);
      AsyncStorage.setItem('bestStreak', streak.toString());
    }
  }, [streak]);

  // Oyun sıfırlama
  const resetGame = () => {
    setScore(0);
    setLives(3);
    setUnlockedLevel(1);
    setXp(0);
    setGameOver(false);
    setSelectedLanguage(null);
    setLevel(1); // Seçim ekranında tekrar doğru seviyeye çekilecek
    setStreak(0);
    setPaused(false);
  };

  // DİKKAT: Dil seçildiğinde kullanıcının o dildeki seviyesini çek ve başlat
  const handleLanguageSelect = async (lang: string) => {
    setSelectedLanguage(lang);
    setLoadingSnippets(true);
    setFetchError(null);
    try {
      setLevel(1);
      setXp(0);
      const data = await fetchSnippets(lang); // level parametresi yok!
      setSnippets(data);
    } catch (e) {
      setFetchError(t(uiLanguage, 'loadError'));
      setSnippets([]);
    } finally {
      setLoadingSnippets(false);
    }
  };

  // Seviye değişince snippet'ları tekrar çek
  useEffect(() => {
    if (selectedLanguage) {
      setLoadingSnippets(true);
      setFetchError(null);
      fetchSnippets(selectedLanguage) // level parametresi yok!
        .then(data => setSnippets(data))
        .catch(() => {
          setFetchError(t(uiLanguage, 'loadError'));
          setSnippets([]);
        })
        .finally(() => setLoadingSnippets(false));
    }
  }, [selectedLanguage]);

  // Profilim butonu her ekranda aktif
  const ProfileButton = (
    <View style={{ position: 'absolute', top: 40, right: 24, zIndex: 30 }}>
      <TouchableOpacity
        style={[
          styles.gameOverButton,
          { minWidth: 110, paddingVertical: 8, paddingHorizontal: 16 },
        ]}
        onPress={() => setShowProfile(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.gameOverButtonText}>
          {t(uiLanguage, 'myProfile')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const PauseButton = (
    <View style={{ position: 'absolute', top: 40, left: 24, zIndex: 30 }}>
      <TouchableOpacity
        style={[
          styles.gameOverButton,
          { minWidth: 110, paddingVertical: 8, paddingHorizontal: 16 },
        ]}
        onPress={() => setPaused(prev => !prev)}
        activeOpacity={0.7}
      >
        <Text style={styles.gameOverButtonText}>
          {paused ? t(uiLanguage, 'resume') : t(uiLanguage, 'pause')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (!user) {
    return (
      <AuthScreen
        onAuth={setUser}
        uiLanguage={uiLanguage}
        onLanguageChange={setUiLanguage}
      />
    );
  }

  if (!selectedLanguage) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {ProfileButton}
        {/* Sadece dil seçtir, level yok */}
        <LanguageSelector
          onSelect={handleLanguageSelect}
          uiLanguage={uiLanguage}
        />
        {showProfile && (
          <View style={[styles.leaderboardModal, { zIndex: 40 }]}>
            {' '}
            {/* Modal gibi üstte */}
            <ProfileScreen
              visible={showProfile}
              onClose={() => setShowProfile(false)}
              uiLanguage={uiLanguage}
              onShowFriends={() => {
                setShowFriends(true);
                setShowProfile(false);
              }}
            />
            <TouchableOpacity
              style={styles.gameOverButton}
              onPress={() => setShowProfile(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.gameOverButtonText}>
                {t(uiLanguage, 'close')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {showFriends && (
          <View style={[styles.leaderboardModal, { zIndex: 45 }]}>
            {' '}
            {/* Modal gibi üstte */}
            <FriendsScreen
              visible={showFriends}
              onClose={() => setShowFriends(false)}
              uiLanguage={uiLanguage}
            />
            <TouchableOpacity
              style={styles.gameOverButton}
              onPress={() => setShowFriends(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.gameOverButtonText}>
                {t(uiLanguage, 'close')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {showFriends && (
          <View style={[styles.leaderboardModal, { zIndex: 45 }]}>
            {' '}
            {/* Modal gibi üstte */}
            <FriendsScreen
              visible={showFriends}
              onClose={() => setShowFriends(false)}
              uiLanguage={uiLanguage}
            />
            <TouchableOpacity
              style={styles.gameOverButton}
              onPress={() => setShowFriends(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.gameOverButtonText}>
                {t(uiLanguage, 'close')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {showFriends && (
          <View style={[styles.leaderboardModal, { zIndex: 45 }]}>
            {' '}
            {/* Modal gibi üstte */}
            <FriendsScreen
              visible={showFriends}
              onClose={() => setShowFriends(false)}
              uiLanguage={uiLanguage}
            />
            <TouchableOpacity
              style={styles.gameOverButton}
              onPress={() => setShowFriends(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.gameOverButtonText}>
                {t(uiLanguage, 'close')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  if (loadingSnippets) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        {ProfileButton}
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={{ color: 'white', marginTop: 20 }}>
          {t(uiLanguage, 'loadingQuestions')}
        </Text>
        {showProfile && (
          <View style={[styles.leaderboardModal, { zIndex: 40 }]}>
            {' '}
            {/* Modal gibi üstte */}
            <ProfileScreen
              visible={showProfile}
              onClose={() => setShowProfile(false)}
              uiLanguage={uiLanguage}
              onShowFriends={() => {
                setShowFriends(true);
                setShowProfile(false);
              }}
            />
            <TouchableOpacity
              style={styles.gameOverButton}
              onPress={() => setShowProfile(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.gameOverButtonText}>
                {t(uiLanguage, 'close')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  if (fetchError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        {ProfileButton}
        <Text style={{ color: 'red', marginBottom: 20 }}>{fetchError}</Text>
        <Button
          title={t(uiLanguage, 'tryAgain')}
          onPress={() => handleLanguageSelect(selectedLanguage!)}
        />
        {showProfile && (
          <View style={[styles.leaderboardModal, { zIndex: 40 }]}>
            {' '}
            {/* Modal gibi üstte */}
            <ProfileScreen
              visible={showProfile}
              onClose={() => setShowProfile(false)}
              uiLanguage={uiLanguage}
              onShowFriends={() => {
                setShowFriends(true);
                setShowProfile(false);
              }}
            />
            <TouchableOpacity
              style={styles.gameOverButton}
              onPress={() => setShowProfile(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.gameOverButtonText}>
                {t(uiLanguage, 'close')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // Yeni: Skor, Can, Rekor kutuları
  const StatsBar = (
    <GameStats
      score={score}
      lives={lives}
      bestScore={bestScore}
      streak={streak}
      bestStreak={bestStreak}
      xp={xp}
      level={level}
      theme={theme}
      t={t}
      uiLanguage={uiLanguage}
    />
  );

  const entities = {};

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {selectedLanguage && !gameOver && PauseButton}
      {StatsBar}
      <NotificationBanner message={notification} />
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[hackSystem(handleAnswer, snippets, uiLanguage)]}
        entities={gameOver ? {} : entities}
        running={!gameOver && !paused}
      >
        {/* Skor, Can, Rekor metinleri kaldırıldı, InfoBar yukarıda */}
      </GameEngine>
      {paused && !gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>{t(uiLanguage, 'paused')}</Text>
          <TouchableOpacity
            style={styles.gameOverButton}
            onPress={() => setPaused(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.gameOverButtonText}>
              {t(uiLanguage, 'resume')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {gameOver && !showLeaderboard && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.finalScore}>
            {t(uiLanguage, 'scoreLabel')}: {score}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginBottom: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={[styles.gameOverButton, { flexShrink: 1, minWidth: 110 }]}
              onPress={() => setShowLeaderboard(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.gameOverButtonText}>
                {t(uiLanguage, 'leaderboard')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.gameOverButton, { flexShrink: 1, minWidth: 110 }]}
              onPress={resetGame}
              activeOpacity={0.7}
            >
              <Text style={styles.gameOverButtonText}>
                {t(uiLanguage, 'playAgain')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.gameOverButton, { flexShrink: 1, minWidth: 110 }]}
              onPress={() => setShowProfile(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.gameOverButtonText}>
                {t(uiLanguage, 'myProfile')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showLeaderboard && (
        <View style={styles.leaderboardModal}>
          <Text style={styles.leaderboardTitle}>
            {t(uiLanguage, 'leaderboard')}
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={[styles.leaderboardHeader, { flex: 1 }]}>
              {t(uiLanguage, 'rank')}
            </Text>
            <Text style={[styles.leaderboardHeader, { flex: 3 }]}>
              {t(uiLanguage, 'usernameLabel')}
            </Text>
            <Text
              style={[
                styles.leaderboardHeader,
                { flex: 1, textAlign: 'right' },
              ]}
            >
              {t(uiLanguage, 'scoreLabel')}
            </Text>
          </View>
          <View style={{ width: '100%' }}>
            {leaderboard.length === 0 && (
              <Text
                style={{
                  color: '#aaa',
                  textAlign: 'center',
                  marginVertical: 12,
                }}
              >
                {t(uiLanguage, 'noScores')}
              </Text>
            )}
            {leaderboard.map((item, idx) => (
              <View
                key={item.id}
                style={[
                  styles.leaderboardRow,
                  { backgroundColor: idx === 0 ? '#1e293b' : 'transparent' },
                ]}
              >
                <Text style={styles.leaderboardRank}>{idx + 1}.</Text>
                <Text style={styles.leaderboardName}>{item.username}</Text>
                <Text style={styles.leaderboardScore}>{item.score}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.gameOverButton}
            onPress={() => setShowLeaderboard(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.gameOverButtonText}>
              {t(uiLanguage, 'close')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {showProfile && (
        <View style={[styles.leaderboardModal, { zIndex: 20 }]}>
          {' '}
          {/* Modal gibi üstte */}
          <ProfileScreen
            visible={showProfile}
            onClose={() => setShowProfile(false)}
            uiLanguage={uiLanguage}
            onShowFriends={() => {
              setShowFriends(true);
              setShowProfile(false);
            }}
          />
          <TouchableOpacity
            style={styles.gameOverButton}
            onPress={() => setShowProfile(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.gameOverButtonText}>
              {t(uiLanguage, 'close')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {showFriends && (
        <View style={[styles.leaderboardModal, { zIndex: 25 }]}>
          {' '}
          {/* Modal gibi üstte */}
          <FriendsScreen
            visible={showFriends}
            onClose={() => setShowFriends(false)}
            uiLanguage={uiLanguage}
          />
          <TouchableOpacity
            style={styles.gameOverButton}
            onPress={() => setShowFriends(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.gameOverButtonText}>
              {t(uiLanguage, 'close')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {ProfileButton}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    gameContainer: { flex: 1 },
    overlay: {
      position: 'absolute',
      top: '30%',
      left: 24,
      right: 24,
      backgroundColor: theme.colors.overlay,
      padding: 32,
      borderRadius: 18,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.22,
      shadowRadius: 16,
      elevation: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    gameOverText: {
      fontSize: 34,
      color: theme.colors.error,
      marginBottom: 18,
      fontWeight: 'bold',
      letterSpacing: 1.2,
      textShadowColor: '#000',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    },
    finalScore: {
      fontSize: 22,
      color: theme.colors.text,
      marginBottom: 22,
      fontWeight: 'bold',
      letterSpacing: 0.5,
      textShadowColor: '#000',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    levelBox: {
      alignSelf: 'center',
      backgroundColor: theme.colors.card,
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderRadius: 10,
      marginTop: 18,
      marginBottom: 8,
      elevation: 2,
    },
    levelBoxText: {
      color: theme.colors.accent,
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      letterSpacing: 1,
    },
    infoBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      marginHorizontal: 18,
      marginTop: 10,
      marginBottom: 8,
      paddingVertical: 10,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    infoItem: {
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 8,
    },
    infoLabel: {
      color: theme.colors.accent,
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 2,
      letterSpacing: 0.5,
      textShadowColor: '#000',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    infoValue: {
      color: theme.colors.text,
      fontSize: 22,
      fontWeight: 'bold',
      textShadowColor: '#000',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    levelSelectContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    levelSelectTitle: {
      color: theme.colors.accent,
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    levelItem: {
      width: 220,
      marginVertical: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    levelActive: {
      backgroundColor: theme.colors.card,
    },
    levelLocked: {
      backgroundColor: theme.colors.border,
      opacity: 0.5,
    },
    leaderboardModal: {
      position: 'absolute',
      top: '18%',
      left: 24,
      right: 24,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 24,
      elevation: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
    },
    leaderboardTitle: {
      color: theme.colors.accent,
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 18,
      letterSpacing: 1,
    },
    leaderboardHeader: {
      color: theme.colors.accent,
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 2,
      textAlign: 'left',
    },
    leaderboardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 6,
      paddingVertical: 6,
      borderRadius: 6,
      paddingHorizontal: 4,
    },
    leaderboardRank: {
      color: theme.colors.text,
      fontSize: 16,
      width: 28,
      textAlign: 'right',
      fontWeight: 'bold',
    },
    leaderboardName: {
      color: theme.colors.text,
      fontSize: 16,
      flex: 1,
      marginLeft: 10,
      fontWeight: 'bold',
    },
    leaderboardScore: {
      color: theme.colors.accent,
      fontSize: 16,
      fontWeight: 'bold',
      width: 40,
      textAlign: 'right',
    },
    leaderboardButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 28,
      alignItems: 'center',
      marginHorizontal: 8,
      elevation: 2,
      borderWidth: 1.5,
      borderColor: '#005bb5',
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    gameOverButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginHorizontal: 8,
      elevation: 2,
      borderWidth: 1.5,
      borderColor: '#005bb5',
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 4,
      minWidth: 120,
    },
    gameOverButtonText: {
      color: theme.colors.text,
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 0.5,
      textAlign: 'center',
    },
  });
