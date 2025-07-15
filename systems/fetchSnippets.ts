import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// language: 'csharp', level: 1 gibi
export async function fetchSnippets(language: string, level: number) {
  let colName = `snippets_${language}`;
  // Artık hem lang hem level'e göre filtrele
  const q = query(
    collection(db, colName),
    where('lang', '==', language),
    where('level', '==', String(level))
  );
  const snapshot = await getDocs(q);
  const snippets: any[] = [];
  snapshot.forEach(doc => {
    snippets.push({ id: doc.id, ...doc.data() });
  });
  return snippets;
}
