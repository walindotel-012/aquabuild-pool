// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB_fmSnrQGxITVXbgwAGgNTEI3scwkRuck",
  authDomain: "aquabuild-pool.firebaseapp.com",
  projectId: "aquabuild-pool",
  storageBucket: "aquabuild-pool.firebasestorage.app",
  messagingSenderId: "915454751717",
  appId: "1:915454751717:web:0b986679cc027087a1750c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };