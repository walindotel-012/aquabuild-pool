// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Verifica que tu configuración esté correcta
const firebaseConfig = {
  apiKey: "AIzaSyB_fmSnrQGxITVXbgwAGgNTEI3scwkRuck",
  authDomain: "aquabuild-pool.firebaseapp.com",
  projectId: "aquabuild-pool",
  storageBucket: "aquabuild-pool.firebasestorage.app",
  messagingSenderId: "915454751717",
  appId: "1:915454751717:web:0b986679cc027087a1750c"
};
let app, db, auth, googleProvider;
let firebaseInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  firebaseInitialized = true;
  console.log('Firebase inicializado');
} catch (error) {
  console.error('Error Firebase:', error);
  db = null;
  auth = null;
  googleProvider = null;
}

export { db, auth, googleProvider, firebaseInitialized };