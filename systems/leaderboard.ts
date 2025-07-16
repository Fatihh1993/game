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
  // progress koleksiyonu: progress/{username}/{lang}_{level}
  const q = query(collection(db, 'progress'), where('username', '==', username));
  const snapshot = await getDocs(q);
  // { lang: [level, ...], ... }
  const progress: Record<string, number[]> = {};
  snapshot.forEach(doc => {
    const { lang, level } = doc.data();
    if (!progress[lang]) progress[lang] = [];
    if (!progress[lang].includes(level)) progress[lang].push(level);
  });
  // Seviyeleri küçükten büyüğe sırala
  Object.keys(progress).forEach(lang => progress[lang].sort((a, b) => a - b));
  return progress;
}

// Oyun sonunda kullanıcının ilerlemesini kaydet
export async function saveUserProgress(username: string, lang: string, level: number) {
  // progress/{username}_{lang}_{level}
  const ref = doc(db, 'progress', `${username}_${lang}_${level}`);
  await setDoc(ref, { username, lang, level }, { merge: true });
}
