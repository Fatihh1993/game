import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

export const Snippet = ({ position, code, onAnswer }: any) => {
  return (
    <View style={[styles.snippetContainer, { top: position[1], left: position[0] }]}>
      <Text style={styles.code}>{code}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.buttonWrapper, styles.correctButton]}
          onPress={() => onAnswer(true)}
        >
          <Text style={styles.buttonText}>Doğru</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonWrapper, styles.wrongButton]}
          onPress={() => onAnswer(false)}
        >
          <Text style={styles.buttonText}>Yanlış</Text>
        </TouchableOpacity>
      </View>
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
});
