

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


const firebaseConfig = {
  apiKey: "AIzaSyB7wmtCHFArmx9RuYvVNof4MUG4Ck-TZW4",
  authDomain: "labonnebouche-e8bd6.firebaseapp.com",
  projectId: "labonnebouche-e8bd6",
  storageBucket: "labonnebouche-e8bd6.appspot.com",
  messagingSenderId: "617687443551",
  appId: "1:617687443551:web:0c875fd0da8897a2f653ea",
  measurementId: "G-TMC0SEYYZE"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


const registerUser = async (email, password, firstName, lastName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;


  await setDoc(doc(db, "users", user.uid), {
    email,
    firstName,
    lastName,
    role: "customer",
  });

  return user;
};

const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;


  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.exists() ? userDoc.data() : null;

  return { user, role: userData?.role };
};


export { auth, db, registerUser, loginUser };
