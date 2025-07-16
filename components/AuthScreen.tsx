import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { registerWithUsername, loginWithUsername } from '../systems/auth';
import { updateProfile } from 'firebase/auth';
import { countries } from './countries';

export default function AuthScreen({ onAuth }: { onAuth: (user: any) => void }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [country, setCountry] = useState('TR');

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
      setError(e.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.authContainer}>
      <View style={styles.authBox}>
        <Text style={styles.title}>{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</Text>
        {registerSuccess && !isRegister && (
          <Text style={styles.success}>Kayıt başarılı! Şimdi giriş yapabilirsiniz.</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        {isRegister && (
          <>
            <TextInput
              style={styles.input}
              placeholder="E-posta"
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
          placeholder="Şifre"
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
            <Text style={styles.buttonText}>{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.authButton, { opacity: loading ? 0.6 : 1 }]}
            onPress={() => { setIsRegister(!isRegister); setError(''); setRegisterSuccess(false); }}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{isRegister ? 'Zaten hesabım var' : 'Hesabım yok, kayıt ol'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authBox: {
    backgroundColor: '#23272f',
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
    color: '#61dafb',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#23272f', // daha koyu ve opak
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    width: 240,
    fontSize: 16,
    borderWidth: 1.5, // kenarlık eklendi
    borderColor: '#3a3f4b', // koyu gri kenarlık
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  error: { color: 'red', marginBottom: 10 },
  success: { color: 'limegreen', marginBottom: 10, fontWeight: 'bold' },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    width: '100%',
    justifyContent: 'space-between',
    gap: 0,
  },
  authButton: {
    backgroundColor: '#007aff',
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    height: 44,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pickerBox: { width: 240, marginBottom: 14, backgroundColor: '#23272f', borderRadius: 8 },
  picker: { color: '#fff', width: 240, height: 44 },
});
