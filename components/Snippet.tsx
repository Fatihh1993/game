import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

export const Snippet = ({
  position,
  code,
  onAnswer,
  explanation,
  isCorrect,
  onToggleExplanation,
  timeLimit = 5, // saniye cinsinden
}: any) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<null | boolean>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (!timerActive || showExplanation) return;
    if (timeLeft <= 0) {
      setShowExplanation(true);
      setTimerActive(false);
      setSelectedAnswer(null);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev: number) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, timerActive, showExplanation]);

  useEffect(() => {
    if (onToggleExplanation) {
      onToggleExplanation(showExplanation);
    }
  }, [showExplanation]);

  const handlePress = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    setTimerActive(false);
  };

  const handleContinue = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    setTimeLeft(timeLimit);
    setTimerActive(true);
    // Kullanıcının seçimi ile doğru cevabı karşılaştır
    const userGotItRight = selectedAnswer === isCorrect;
    onAnswer(userGotItRight);
  };

  const screenHeight = Dimensions.get('window').height;
  const snippetHeight = 260; // tahmini yükseklik
  // Pozisyonu ayarla: Eğer kutu ekranın altına taşacaksa yukarıda göster
  const topPos = position[1] + snippetHeight > screenHeight - 20 ? screenHeight - snippetHeight - 20 : position[1];

  return (
    <View style={[styles.snippetContainer, { top: topPos, left: position[0] }]}>
      <Text style={styles.code}>{code}</Text>
      <View style={styles.timerBarContainer}>
        <View style={[styles.timerBar, { width: `${(timeLeft / timeLimit) * 100}%` }]} />
      </View>
      <Text style={styles.timerText}>{timeLeft} sn</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.buttonWrapper, styles.correctButton]}
          onPress={() => handlePress(true)}
          disabled={showExplanation || timeLeft <= 0}
        >
          <Text style={styles.buttonText}>Doğru</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonWrapper, styles.wrongButton]}
          onPress={() => handlePress(false)}
          disabled={showExplanation || timeLeft <= 0}
        >
          <Text style={styles.buttonText}>Yanlış</Text>
        </TouchableOpacity>
      </View>
      {showExplanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>Neden {isCorrect ? 'Doğru' : 'Yanlış'}?</Text>
          <Text style={styles.explanationText}>{explanation || 'Açıklama yok.'}</Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Devam Et</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  snippetContainer: {
    position: 'absolute',
    backgroundColor: '#282c34',
    padding: 12,
    borderRadius: 6,
    maxWidth: 340,
    minWidth: 260,
    width: 'auto',
  },
  code: {
    color: '#61dafb',
    fontFamily: 'monospace',
    fontSize: 16,
    marginBottom: 10,
  },
  timerBarContainer: {
    height: 8,
    width: '100%',
    backgroundColor: '#444',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  timerBar: {
    height: 8,
    backgroundColor: '#61dafb',
    borderRadius: 4,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    alignSelf: 'flex-end',
    marginBottom: 6,
    marginRight: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#2ecc40',
  },
  wrongButton: {
    backgroundColor: '#ff4136',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  explanationBox: {
    marginTop: 10,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 6,
  },
  explanationTitle: {
    color: '#61dafb',
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },
  explanationText: {
    color: '#fff',
    fontSize: 15,
  },
  continueButton: {
    marginTop: 12,
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
