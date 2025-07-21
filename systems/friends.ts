import { collection, query, where, getDocs, setDoc, doc, deleteDoc, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { fetchUserProgress } from './leaderboard';

export async function searchUsers(keyword: string) {
  if (!keyword) return [];
  const q = query(
    collection(db, 'usernames'),
    where('username', '>=', keyword),
    where('username', '<=', keyword + '\uf8ff'),
    limit(10)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data());
}

export async function sendFriendRequest(from: string, to: string) {
  if (from === to) return;
  const id = `${from}_${to}`;
  await setDoc(doc(db, 'friend_requests', id), { from, to });
}

export async function fetchFriendRequests(username: string) {
  const q = query(collection(db, 'friend_requests'), where('to', '==', username));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data());
}

export async function acceptFriendRequest(from: string, to: string) {
  const id = `${from}_${to}`;
  await deleteDoc(doc(db, 'friend_requests', id));
  const users = [from, to].sort();
  const fId = users.join('_');
  await setDoc(doc(db, 'friends', fId), { users });
}

export async function fetchFriends(username: string) {
  const q = query(collection(db, 'friends'), where('users', 'array-contains', username));
  const snapshot = await getDocs(q);
  const friends: string[] = [];
  snapshot.forEach(doc => {
    const users: string[] = doc.data().users;
    const friend = users.find(u => u !== username);
    if (friend) friends.push(friend);
  });
  return friends;
}

export async function fetchFriendsWithProgress(username: string) {
  const names = await fetchFriends(username);
  const result = await Promise.all(
    names.map(async n => ({ username: n, progress: await fetchUserProgress(n) }))
  );
  return result;
}

export function subscribeFriendRequests(username: string, cb: (reqs: any[]) => void) {
  const q = query(collection(db, 'friend_requests'), where('to', '==', username));
  return onSnapshot(q, snapshot => {
    cb(snapshot.docs.map(d => d.data()));
  });
}
