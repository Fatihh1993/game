import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function fetchSnippets(language: string) {
  let colName = `snippets_${language}`;
  const q = query(
    collection(db, colName),
    where('lang', '==', language)
  );
  const snapshot = await getDocs(q);
  const snippets: any[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    snippets.push({ id: doc.id, ...data });
  });
  return snippets;
}
