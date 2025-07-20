import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageSelector } from './components/LanguageSelector';
import { hackSystem } from './systems/hack';
import { fetchSnippets } from './systems/fetchSnippets';
import AuthScreen from './components/AuthScreen';
import { auth } from './systems/auth';
import { fetchLeaderboard, submitScore, saveUserProgress, fetchUserProgress } from './systems/leaderboard';
import ProfileScreen from './components/ProfileScreen';
import { Lang, t } from './translations';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [uiLanguage, setUiLanguage] = useState<Lang>('tr');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [correctInLevel, setCorrectInLevel] = useState(0);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loadingSnippets, setLoadingSnippets] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [savingScore, setSavingScore] = useState(false);
  const [lbError, setLbError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const gameEngineRef = useRef<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('bestScore').then(value => {
      if (value) setBestScore(parseInt(value));
    });
  }, []);

  // Kullanıcıyı dinle (oturum açık mı?)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return unsubscribe;
  }, []);

  // Oyun bittiğinde skor kaydet ve leaderboard'ı getir
  useEffect(() => {
    if (gameOver && user && selectedLanguage) {
      setSavingScore(true);
      const username = user.displayName || user.email || t(uiLanguage, 'usernameLabel');
      submitScore(username, score, selectedLanguage)
        .then(() => fetchLeaderboard(selectedLanguage).then(setLeaderboard))
        .catch(() => setLbError(t(uiLanguage, 'genericError')))
        .finally(() => setSavingScore(false));
      if (level) {
        saveUserProgress(username, selectedLanguage, level);
      }
    }
  }, [gameOver, user, selectedLanguage, level]);

  const handleAnswer = async (isCorrect: boolean | null, id: string) => {
    if (isCorrect === null) return;
    const isRight = isCorrect === true;
    setScore(prev => prev + (isRight ? 1 : 0));
    if (isRight) {
      setCorrectInLevel(prev => {
        const newCorrect = prev + 1;
        if (newCorrect >= 5) {
          setLevel(lvl => lvl + 1);
          return 0;
        }
        return newCorrect;
      });
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

  // Oyun sıfırlama
  const resetGame = () => {
    setScore(0);
    setLives(3);
    setUnlockedLevel(1);
    setCorrectInLevel(0);
    setGameOver(false);
    setSelectedLanguage(null);
    setLevel(1); // Seçim ekranında tekrar doğru seviyeye çekilecek
  };

  // DİKKAT: Dil seçildiğinde kullanıcının o dildeki seviyesini çek ve başlat
  const handleLanguageSelect = async (lang: string) => {
    setSelectedLanguage(lang);
    setLoadingSnippets(true);
    setFetchError(null);
    try {
      const username = user.displayName || user.email;
      const progress = await fetchUserProgress(username);
      const userLevel = progress?.[lang] || 1;
      setLevel(userLevel);
      setCorrectInLevel(0);
      const data = await fetchSnippets(lang, userLevel);
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
    if (selectedLanguage && level) {
      setLoadingSnippets(true);
      setFetchError(null);
      fetchSnippets(selectedLanguage, level)
        .then(data => setSnippets(data))
        .catch(() => {
          setFetchError(t(uiLanguage, 'loadError'));
          setSnippets([]);
        })
        .finally(() => setLoadingSnippets(false));
    }
  }, [selectedLanguage, level]);

  // Profilim butonu her ekranda aktif
  const ProfileButton = (
    <View style={{ position: 'absolute', top: 40, right: 24, zIndex: 30 }}>
      <TouchableOpacity style={[styles.gameOverButton, { minWidth: 110, paddingVertical: 8, paddingHorizontal: 16 }]} onPress={() => setShowProfile(true)} activeOpacity={0.7}>
        <Text style={styles.gameOverButtonText}>{t(uiLanguage, 'myProfile')}</Text>
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
      <View style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
        {ProfileButton}
        {/* Sadece dil seçtir, level yok */}
        <LanguageSelector
          onSelect={handleLanguageSelect}
          uiLanguage={uiLanguage}
        />
        {showProfile && (
          <View style={[styles.leaderboardModal, { zIndex: 40 }]}> {/* Modal gibi üstte */}
            <ProfileScreen visible={showProfile} onClose={() => setShowProfile(false)} uiLanguage={uiLanguage} />
            <TouchableOpacity style={styles.gameOverButton} onPress={() => setShowProfile(false)} activeOpacity={0.7}>
              <Text style={styles.gameOverButtonText}>{t(uiLanguage, 'close')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  if (loadingSnippets) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e1e' }}>
        {ProfileButton}
        <ActivityIndicator size="large" color="#61dafb" />
        <Text style={{ color: 'white', marginTop: 20 }}>{t(uiLanguage, 'loadingQuestions')}</Text>
        {showProfile && (
          <View style={[styles.leaderboardModal, { zIndex: 40 }]}> {/* Modal gibi üstte */}
            <ProfileScreen visible={showProfile} onClose={() => setShowProfile(false)} uiLanguage={uiLanguage} />
            <TouchableOpacity style={styles.gameOverButton} onPress={() => setShowProfile(false)} activeOpacity={0.7}>
              <Text style={styles.gameOverButtonText}>{t(uiLanguage, 'close')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e1e' }}>
        {ProfileButton}
        <Text style={{ color: 'red', marginBottom: 20 }}>{fetchError}</Text>
        <Button title={t(uiLanguage, 'tryAgain')} onPress={() => handleLanguageSelect(selectedLanguage!)} />
        {showProfile && (
          <View style={[styles.leaderboardModal, { zIndex: 40 }]}> {/* Modal gibi üstte */}
            <ProfileScreen visible={showProfile} onClose={() => setShowProfile(false)} uiLanguage={uiLanguage} />
            <TouchableOpacity style={styles.gameOverButton} onPress={() => setShowProfile(false)} activeOpacity={0.7}>
              <Text style={styles.gameOverButtonText}>{t(uiLanguage, 'close')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // Level kutusu UI
  const LevelBox = (
    <View style={styles.levelBox}>
      <Text style={styles.levelBoxText}>{t(uiLanguage, 'level')} {level}</Text>
    </View>
  );

  // Yeni: Skor, Can, Rekor kutuları
  const InfoBar = (
    <View style={styles.infoBar}>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{t(uiLanguage, 'score')}</Text>
        <Text style={styles.infoValue}>{score}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{t(uiLanguage, 'lives')}</Text>
        <Text style={styles.infoValue}>{lives}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{t(uiLanguage, 'best')}</Text>
        <Text style={styles.infoValue}>{bestScore}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{t(uiLanguage, 'level')}</Text>
        <Text style={styles.infoValue}>{level}</Text>
      </View>
    </View>
  );

  const entities = {};

  return (
    <View style={[styles.container, { backgroundColor: '#1e1e1e' }]}>
      {LevelBox}
      {InfoBar}
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[hackSystem(handleAnswer, snippets, uiLanguage)]}
        entities={gameOver ? {} : entities}
        running={!gameOver}
      >
        {/* Skor, Can, Rekor metinleri kaldırıldı, InfoBar yukarıda */}
      </GameEngine>
      {gameOver && !showLeaderboard && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.finalScore}>{t(uiLanguage, 'scoreLabel')}: {score}</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <TouchableOpacity style={[styles.gameOverButton, { flexShrink: 1, minWidth: 110 }]} onPress={() => setShowLeaderboard(true)} activeOpacity={0.7}>
          <Text style={styles.gameOverButtonText}>{t(uiLanguage, 'leaderboard')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gameOverButton, { flexShrink: 1, minWidth: 110 }]} onPress={resetGame} activeOpacity={0.7}>
          <Text style={styles.gameOverButtonText}>{t(uiLanguage, 'playAgain')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gameOverButton, { flexShrink: 1, minWidth: 110 }]} onPress={() => setShowProfile(true)} activeOpacity={0.7}>
          <Text style={styles.gameOverButtonText}>{t(uiLanguage, 'myProfile')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showLeaderboard && (
        <View style={styles.leaderboardModal}>
          <Text style={styles.leaderboardTitle}>{t(uiLanguage, 'leaderboard')}</Text>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={[styles.leaderboardHeader, { flex: 1 }]}>{t(uiLanguage, 'rank')}</Text>
            <Text style={[styles.leaderboardHeader, { flex: 3 }]}>{t(uiLanguage, 'usernameLabel')}</Text>
            <Text style={[styles.leaderboardHeader, { flex: 1, textAlign: 'right' }]}>{t(uiLanguage, 'scoreLabel')}</Text>
          </View>
          <View style={{ width: '100%' }}>
            {leaderboard.length === 0 && (
              <Text style={{ color: '#aaa', textAlign: 'center', marginVertical: 12 }}>{t(uiLanguage, 'noScores')}</Text>
            )}
            {leaderboard.map((item, idx) => (
              <View key={item.id} style={[styles.leaderboardRow, { backgroundColor: idx === 0 ? '#1e293b' : 'transparent' }]}> 
                <Text style={styles.leaderboardRank}>{idx + 1}.</Text>
                <Text style={styles.leaderboardName}>{item.username}</Text>
                <Text style={styles.leaderboardScore}>{item.score}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.gameOverButton} onPress={() => setShowLeaderboard(false)} activeOpacity={0.7}>
            <Text style={styles.gameOverButtonText}>{t(uiLanguage, 'close')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {showProfile && (
        <View style={[styles.leaderboardModal, { zIndex: 20 }]}> {/* Modal gibi üstte */}
          <ProfileScreen visible={showProfile} onClose={() => setShowProfile(false)} uiLanguage={uiLanguage} />
          <TouchableOpacity style={styles.gameOverButton} onPress={() => setShowProfile(false)} activeOpacity={0.7}>
            <Text style={styles.gameOverButtonText}>{t(uiLanguage, 'close')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {ProfileButton}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e' },
  gameContainer: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: '30%',
    left: 24,
    right: 24,
    backgroundColor: '#23272fee', // daha koyu ve opak
    padding: 32,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#3a3f4b', // belirgin kenarlık
  },
  gameOverText: {
    fontSize: 34,
    color: '#ff4d6d',
    marginBottom: 18,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  finalScore: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  levelBox: {
    alignSelf: 'center',
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 18,
    marginBottom: 8,
    elevation: 2,
  },
  levelBoxText: {
    color: '#61dafb',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#23272f',
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
    color: '#61dafb',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 0.5,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  levelSelectContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelSelectTitle: {
    color: '#61dafb',
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
    backgroundColor: '#222',
  },
  levelLocked: {
    backgroundColor: '#444',
    opacity: 0.5,
  },
  leaderboardModal: {
    position: 'absolute',
    top: '18%',
    left: 24,
    right: 24,
    backgroundColor: '#23272f',
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  leaderboardTitle: {
    color: '#61dafb',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    letterSpacing: 1,
  },
  leaderboardHeader: {
    color: '#61dafb',
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
    color: '#fff',
    fontSize: 16,
    width: 28,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  leaderboardName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  leaderboardScore: {
    color: '#61dafb',
    fontSize: 16,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  leaderboardButton: {
    backgroundColor: '#007aff',
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
    backgroundColor: '#007aff',
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
