// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-logo-generator-d8ee4.firebaseapp.com",
  projectId: "ai-logo-generator-d8ee4",
  storageBucket: "ai-logo-generator-d8ee4.firebasestorage.app",
  messagingSenderId: "986268297814",
  appId: "1:986268297814:web:a9e753b0eca4e8e30b29f7",
  measurementId: "G-YPHM6HHBDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)