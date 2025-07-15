import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const LanguageSelector = ({ onSelect, unlockedLevel = 1 }: { onSelect: (lang: string, level: number) => void, unlockedLevel?: number }) => {
  const [language, setLanguage] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const handleReady = () => {
    if (language && level) {
      setDone(true);
      onSelect(language, level);
    }
  };

  if (done) return null;

  return (
    <View style={styles.container}>
      {!language ? (
        <>
          <Text style={styles.title}>Bir dil seç</Text>
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={() => setLanguage('csharp')}>
                <Text style={styles.buttonText}>C#</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setLanguage('sql')}>
                <Text style={styles.buttonText}>SQL</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={() => setLanguage('javascript')}>
                <Text style={styles.buttonText}>JavaScript</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setLanguage('python')}>
                <Text style={styles.buttonText}>Python</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : !level ? (
        <>
          <Text style={styles.title}>Bir Seviye Seç</Text>
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.button, lvl > unlockedLevel && styles.levelLocked]}
                  onPress={() => lvl <= unlockedLevel && setLevel(lvl)}
                  disabled={lvl > unlockedLevel}
                >
                  <Text style={styles.buttonText}>{`Seviye ${lvl}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Kodlar Geliyor, Hazır mısın?</Text>
          <TouchableOpacity style={styles.readyButton} onPress={handleReady}>
            <Text style={styles.buttonText}>EVET</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#61dafb',
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonGrid: {
    gap: 20,
  },
  buttonRow: {
    flexDirection: 'column', // alt alta
    justifyContent: 'center',
    marginBottom: 10,
    gap: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#282c34',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  readyButton: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelLocked: {
    opacity: 0.5,
  },
});
