import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const LanguageSelector = ({ onSelect }: { onSelect: (lang: string) => void }) => {
  const [language, setLanguage] = useState<string | null>(null);

  const handleReady = () => {
    if (language) {
      onSelect(language);
    }
  };

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
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 20,
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
});
