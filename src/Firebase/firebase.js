import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {
  getFunctions,
  httpsCallable,
} from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7wmtCHFArmx9RuYvVNof4MUG4Ck-TZW4",
  authDomain: "labonnebouche-e8bd6.firebaseapp.com",
  projectId: "labonnebouche-e8bd6",
  storageBucket: "labonnebouche-e8bd6.appspot.com",
  messagingSenderId: "617687443551",
  appId: "1:617687443551:web:0c875fd0da8897a2f653ea",
  measurementId: "G-TMC0SEYYZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// ✅ Register new user and store phone
const registerUser = async (email, password, firstName, lastName, phoneNumber) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    firstName,
    lastName,
    phoneNumber, // ✅ store phone
    role: "customer",
    createdAt: new Date()
  });

  return user;
};

// 🔐 Login user
const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.exists() ? userDoc.data() : null;

  return { user, role: userData?.role };
};

// 🔥 Delete Firebase Auth user via callable function
const deleteUserFromAuth = async (uid) => {
  const callable = httpsCallable(functions, 'deleteUserFromAuth');
  return await callable({ uid });
};

// 📦 Export
export {
  auth,
  db,
  functions,
  registerUser,
  loginUser,
  deleteUserFromAuth
};
