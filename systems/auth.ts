import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, setDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { app, db } from '../firebaseConfig';

const auth = getAuth(app);

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}

// Kullanıcı adı ile kayıt: önce kullanıcı adı boş mu kontrol et, sonra kaydet
export async function registerWithUsername(username: string, email: string, password: string) {
  // Kullanıcı adı benzersiz mi?
  const q = query(collection(db, 'usernames'), where('username', '==', username));
  const snapshot = await getDocs(q);
  if (!username || snapshot.size > 0) {
    throw new Error('Kullanıcı adı alınmış veya geçersiz.');
  }
  // Firebase Auth ile kayıt
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Firestore'a kullanıcı adı ve email eşlemesini kaydet
  await setDoc(doc(db, 'usernames', username), {
    username,
    email,
    uid: userCredential.user.uid,
  });
  return userCredential;
}

// Kullanıcı adı ile giriş: önce email bul, sonra Auth ile giriş
export async function loginWithUsername(username: string, password: string) {
  const ref = doc(db, 'usernames', username);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Kullanıcı adı bulunamadı.');
  const { email } = snap.data();
  return signInWithEmailAndPassword(auth, email, password);
}

export { auth };
