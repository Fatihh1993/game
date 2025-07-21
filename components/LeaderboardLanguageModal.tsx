import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Lang, t } from '../translations';

export default function LeaderboardLanguageModal({ visible, onSelect, onClose, uiLanguage }: { visible: boolean; onSelect: (lang: string) => void; onClose: () => void; uiLanguage: Lang }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t(uiLanguage, 'selectLanguage')}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={() => onSelect('csharp')} activeOpacity={0.7}>
              <Text style={styles.buttonText}>C#</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onSelect('sql')} activeOpacity={0.7}>
              <Text style={styles.buttonText}>SQL</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={() => onSelect('javascript')} activeOpacity={0.7}>
              <Text style={styles.buttonText}>JavaScript</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onSelect('python')} activeOpacity={0.7}>
              <Text style={styles.buttonText}>Python</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.buttonText}>{t(uiLanguage, 'close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.accent,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});
