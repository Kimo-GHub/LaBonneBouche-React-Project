// src/Firebase/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7wmtCHFArmx9RuYvVNof4MUG4Ck-TZW4",
  authDomain: "labonnebouche-e8bd6.firebaseapp.com",
  projectId: "labonnebouche-e8bd6",
  storageBucket: "labonnebouche-e8bd6.appspot.com", // corrected domain here
  messagingSenderId: "617687443551",
  appId: "1:617687443551:web:0c875fd0da8897a2f653ea",
  measurementId: "G-TMC0SEYYZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Register user
const registerUser = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login user (optional, if you need it for login page)
const loginUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Exports
export { auth, db, registerUser, loginUser };
