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

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
  // Si falla, crea objetos dummy para evitar errores de importación
  db = null;
  auth = null;
  googleProvider = null;
}

export { db, auth, googleProvider };