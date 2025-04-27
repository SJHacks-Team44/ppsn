import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKtwUbCpkBEREYSdyMZEiAhuMs3Rh78nQ",
  authDomain: "ppsn-hackathon.firebaseapp.com",
  projectId: "ppsn-hackathon",
  storageBucket: "ppsn-hackathon.firebasestorage.app",
  messagingSenderId: "661873236491",
  appId: "1:661873236491:web:ae1316f1400522297f450e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const signUp = async (email, password, rememberMe) => {
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userId = email.split('@')[0]; // ✅ Extract userId from email

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    userId: userId, // ✅ Save userId (before @)
    createdAt: new Date(),
  });

  return user;
};

export const signIn = async (email, password, rememberMe) => {
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logOut = async () => {
  await signOut(auth);
};
