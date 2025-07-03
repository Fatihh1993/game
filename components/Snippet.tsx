import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export const Snippet = ({ position, code, onAnswer }: any) => {
  return (
    <View style={[styles.snippetContainer, { top: position[1], left: position[0] }]}>
      <Text style={styles.code}>{code}</Text>
      <View style={styles.buttonRow}>
        <Button title="Doğru" onPress={() => onAnswer(true)} />
        <Button title="Yanlış" onPress={() => onAnswer(false)} />
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
    gap: 10,
  },
});
