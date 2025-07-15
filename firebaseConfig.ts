// Firebase config dosyası. Kendi projenizin config bilgileriyle doldurun.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwynpZJdfWL2rjFODeFDjsEm70SKLDN4o",
  authDomain: "game-cd32e.firebaseapp.com",
  projectId: "game-cd32e",
  storageBucket: "game-cd32e.firebasestorage.app",
  messagingSenderId: "6623134957",
  appId: "1:6623134957:web:4177360b23b410794d78e4",
  measurementId: "G-JZGDC31KV5"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
