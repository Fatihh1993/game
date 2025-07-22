import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, darkTheme } from '../theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { registerWithUsername, loginWithUsername } from '../systems/auth';
import { updateProfile } from 'firebase/auth';
import { countries } from './countries';
import { Lang, t } from '../translations';

export default function AuthScreen({
  onAuth,
  uiLanguage,
  onLanguageChange,
}: {
  onAuth: (user: any) => void;
  uiLanguage: Lang;
  onLanguageChange: (lang: Lang) => void;

}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [country, setCountry] = useState('TR');

  const { theme, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);


  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        const userCredential = await registerWithUsername(username, email, password, country);
        await updateProfile(userCredential.user, { displayName: username });
        setRegisterSuccess(true);
        setIsRegister(false);
        setUsername('');
        setEmail('');
        setPassword('');
        setCountry('TR');
        return;
      } else {
        const userCredential = await loginWithUsername(username, password);
        await updateProfile(userCredential.user, { displayName: username });
        onAuth(userCredential.user);
      }
    } catch (e: any) {
      setError(e.message || t(uiLanguage, 'genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.authContainer, { backgroundColor: theme.colors.background }]}>
      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langButton, uiLanguage === 'tr' && styles.langButtonActive]}
          onPress={() => onLanguageChange('tr')}
        >
          <Text style={styles.langButtonText}>TR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langButton, uiLanguage === 'en' && styles.langButtonActive]}
          onPress={() => onLanguageChange('en')}
        >
          <Text style={styles.langButtonText}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          {theme === darkTheme ? (
            <Ionicons name="sunny" size={20} color={theme.colors.text} />
          ) : (
            <Ionicons name="moon" size={20} color={theme.colors.text} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.authBox}>
        <Text style={styles.title}>{isRegister ? t(uiLanguage, 'registerTitle') : t(uiLanguage, 'loginTitle')}</Text>
        {registerSuccess && !isRegister && (
          <Text style={styles.success}>{t(uiLanguage, 'registerSuccess')}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder={t(uiLanguage, 'username')}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        {isRegister && (
          <>
            <TextInput
              style={styles.input}
              placeholder={t(uiLanguage, 'email')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={country}
                style={styles.picker}
                onValueChange={setCountry}
              >
                {countries.map((c) => (
                  <Picker.Item key={c.code} label={`${c.flag} ${c.name}`} value={c.code} />
                ))}
              </Picker>
            </View>
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder={t(uiLanguage, 'password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.authButton, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
          >
          <Text style={styles.buttonText}>{isRegister ? t(uiLanguage, 'registerButton') : t(uiLanguage, 'loginButton')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.authButton, { opacity: loading ? 0.6 : 1 }]}
            onPress={() => { setIsRegister(!isRegister); setError(''); setRegisterSuccess(false); }}
            disabled={loading}
            activeOpacity={0.7}
          >
          <Text style={styles.buttonText}>{isRegister ? t(uiLanguage, 'toggleToLogin') : t(uiLanguage, 'toggleToRegister')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
  },
  langButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  langButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  themeButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  langButtonText: { color: theme.colors.text, fontWeight: 'bold' },
  authBox: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 28,
    width: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    color: theme.colors.accent,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    width: 240,
    fontSize: 16,
    borderWidth: 1.5, // kenarlık eklendi
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  error: { color: theme.colors.error, marginBottom: 10 },
  success: { color: theme.colors.success, marginBottom: 10, fontWeight: 'bold' },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    width: '100%',
    justifyContent: 'space-between',
    gap: 0,
  },
  authButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    height: 44,
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pickerBox: { width: 240, marginBottom: 14, backgroundColor: theme.colors.card, borderRadius: 8 },
  picker: { color: theme.colors.text, width: 240, height: 44 },
});
