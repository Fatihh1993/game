import { collection, getDocs, orderBy, limit, query, doc, getDoc, setDoc, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function submitScore(username: string, score: number, language: string) {
  const docId = `${language}_${username}`;
  const ref = doc(db, 'leaderboard', docId);
  const snap = await getDoc(ref);
  if (!snap.exists() || score > (snap.data()?.score || 0)) {
    await setDoc(ref, {
      username,
      score,
      language,
      createdAt: Date.now(),
    });
  }
}

export async function fetchLeaderboard(language: string, topN: number = 10) {
  const q = query(
    collection(db, 'leaderboard'),
    where('language', '==', language),
    orderBy('score', 'desc'),
    limit(topN)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id, // <-- id ekleniyor!
    ...doc.data()
  }));
}

// Kullanıcının hangi dilde hangi seviyede oynadığını döndürür
export async function fetchUserProgress(username: string) {
  const ref = doc(db, 'progress', username);
  const snap = await getDoc(ref);
  if (!snap.exists()) return {};
  return snap.data(); // { csharp: 5, python: 2, ... }
}

// Oyun sonunda kullanıcının ilerlemesini kaydet
export async function saveUserProgress(username: string, lang: string, level: number) {
  const ref = doc(db, 'progress', username);
  // Mevcut ilerlemeyi çek
  const snap = await getDoc(ref);
  let progress = {};
  if (snap.exists()) {
    progress = snap.data();
  }
  // O dildeki level'ı güncelle
  await setDoc(ref, { ...progress, [lang]: level }, { merge: true });
}

// App.tsx veya ilgili yerde
// Pass 'user' as a parameter to the function
const handleLanguageSelect = async (lang: string, user: { displayName?: string; email?: string }) => {
  setSelectedLanguage(lang);
  const username = user.displayName ?? user.email;
  if (!username) {
    throw new Error('User must have a displayName or email');
  }
  const progress = await fetchUserProgress(username);
  const userLevel = progress?.[lang] || 1;
  setLevel(userLevel);
};

// Dummy implementation for setLevel to avoid error
function setLevel(level: number) {
  // Implement this function or import it from the relevant module
  console.log('Set level to:', level);
}

function setSelectedLanguage(lang: string) {
  throw new Error('Function not implemented.');
}

