import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const Snippet = ({
  position,
  code,
  onAnswer,
  explanation,
  isCorrect,
  onToggleExplanation,
}: any) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<null | boolean>(null);

  useEffect(() => {
    if (onToggleExplanation) {
      onToggleExplanation(showExplanation);
    }
  }, [showExplanation]);

  const handlePress = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  const handleContinue = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    onAnswer(selectedAnswer);
  };

  return (
    <View style={[styles.snippetContainer, { top: position[1], left: position[0] }]}>
      <Text style={styles.code}>{code}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.buttonWrapper, styles.correctButton]}
          onPress={() => handlePress(true)}
          disabled={showExplanation}
        >
          <Text style={styles.buttonText}>Doğru</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonWrapper, styles.wrongButton]}
          onPress={() => handlePress(false)}
          disabled={showExplanation}
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
