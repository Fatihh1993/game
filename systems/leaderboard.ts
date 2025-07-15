import { collection, getDocs, orderBy, limit, query, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function submitScore(username: string, score: number) {
  // Her kullanıcı için tek skor: username'i belge id'si olarak kullan
  const ref = doc(db, 'leaderboard', username);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // İlk kez skor kaydediliyor
    await setDoc(ref, {
      username,
      score,
      createdAt: Date.now(),
    });
  } else {
    // Önceki skorunu kontrol et, daha yüksekse güncelle
    const prev = snap.data();
    if (score > (prev.score || 0)) {
      await setDoc(ref, {
        username,
        score,
        createdAt: Date.now(),
      });
    }
  }
}

export async function fetchLeaderboard(topN: number = 10) {
  const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(topN));
  const snapshot = await getDocs(q);
  const results: any[] = [];
  snapshot.forEach(doc => {
    results.push({ id: doc.id, ...doc.data() });
  });
  return results;
}
