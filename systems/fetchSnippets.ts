import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function fetchSnippets(language: string, level: number) {
  let colName = `snippets_${language}`;
  const q = query(
    collection(db, colName),
    where('lang', '==', language)
  );
  const snapshot = await getDocs(q);
  const snippets: any[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    // level alanı string, sayıya çevirip karşılaştır
    if (parseInt(data.level, 10) <= level) {
      snippets.push({ id: doc.id, ...data });
    }
  });
  return snippets;
}
