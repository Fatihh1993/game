import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Lang, t } from '../translations';

export const Snippet = ({
  position,
  code,
  onAnswer,
  explanation,
  isCorrect,
  isGold,
  onToggleExplanation,
  timeLimit = 5,
  uiLanguage,
}: {
  position: number[];
  code: any;
  onAnswer: Function;
  explanation: any;
  isCorrect: boolean;
  isGold?: boolean;
  onToggleExplanation: (val: boolean) => void;
  timeLimit?: number;
  uiLanguage: Lang;
}) => {
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
    onAnswer(userGotItRight, isGold);
  };

  const screenHeight = Dimensions.get('window').height;
  const snippetHeight = 260; // tahmini yükseklik
  // Pozisyonu ayarla: Eğer kutu ekranın altına taşacaksa yukarıda göster
  const topPos =
    position[1] + snippetHeight > screenHeight - 20
      ? screenHeight - snippetHeight - 20
      : position[1];

  return (
    <View
      style={[
        styles.snippetContainer,
        isGold && styles.goldContainer,
        { top: topPos, left: position[0] },
      ]}
    >
      {isGold && (
        <Text style={styles.goldLabel}>⭐ {t(uiLanguage, 'goldQuestion')}</Text>
      )}
      <Text style={styles.code}>
        {typeof code === 'object' ? code[uiLanguage] || code['en'] : code}
      </Text>
      <View style={styles.timerBarContainer}>
        <View
          style={[
            styles.timerBar,
            { width: `${(timeLeft / timeLimit) * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.timerText}>
        {timeLeft} {t(uiLanguage, 'secondsAbbrev')}
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.buttonWrapper, styles.correctButton]}
          onPress={() => handlePress(true)}
          disabled={showExplanation || timeLeft <= 0}
        >
          <Text style={styles.buttonText}>{t(uiLanguage, 'correct')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonWrapper, styles.wrongButton]}
          onPress={() => handlePress(false)}
          disabled={showExplanation || timeLeft <= 0}
        >
          <Text style={styles.buttonText}>{t(uiLanguage, 'wrong')}</Text>
        </TouchableOpacity>
      </View>
      {showExplanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>
            {isCorrect ? 'Why Correct?' : 'Why Wrong?'}
          </Text>
          <Text style={styles.explanationText}>
            {typeof explanation === 'object'
              ? explanation[uiLanguage] || explanation['en']
              : explanation}
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>
              {t(uiLanguage, 'continue')}
            </Text>
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
  goldContainer: {
    borderColor: '#ffd700',
    borderWidth: 2,
  },
  goldLabel: {
    color: '#ffd700',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 4,
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
