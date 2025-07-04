import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageSelector } from './components/LanguageSelector';
import { hackSystem } from './systems/hack';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameEngineRef = useRef<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('bestScore').then(value => {
      if (value) setBestScore(parseInt(value));
    });
  }, []);

  useEffect(() => {
    const newLevel = Math.floor(score / 10) + 1;
    setLevel(newLevel);
  }, [score]);

  const handleAnswer = async (isCorrect: boolean | null, id: string) => {
    if (isCorrect === null) return;
    const isRight = isCorrect === true;
    setScore(prev => prev + (isRight ? 1 : 0));

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

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setSelectedLanguage(null);
  };

  if (!selectedLanguage) {
    return <LanguageSelector onSelect={setSelectedLanguage} />;
  }

  const entities = {};

  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[hackSystem(handleAnswer, selectedLanguage)]}
        entities={gameOver ? {} : entities}
        running={!gameOver}
      >
        <Text style={styles.score}>Skor: {score}</Text>
        <Text style={styles.level}>Seviye: {level}</Text>
        <Text style={styles.lives}>Can: {lives}</Text>
        <Text style={styles.best}>Rekor: {bestScore}</Text>
      </GameEngine>

      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.finalScore}>Puan: {score}</Text>
          <Button title="Tekrar Oyna" onPress={resetGame} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e' },
  gameContainer: { flex: 1 },
  score: { position: 'absolute', top: 30, left: 20, color: 'white', fontSize: 18 },
  level: { position: 'absolute', top: 30, left: 130, color: 'white', fontSize: 18 },
  lives: { position: 'absolute', top: 30, left: 250, color: 'white', fontSize: 18 },
  best: { position: 'absolute', top: 60, left: 20, color: '#999', fontSize: 14 },
  overlay: {
    position: 'absolute',
    top: 200,
    left: 50,
    right: 50,
    backgroundColor: '#000000cc',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    color: 'red',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  finalScore: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
});
