// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmy3eaOnp6V_PAI2kmhfmB7mRw_U7lCqI",
  authDomain: "e-commerce-1c947.firebaseapp.com",
  projectId: "e-commerce-1c947",
  storageBucket: "e-commerce-1c947.firebasestorage.app",
  messagingSenderId: "487041339748",
  appId: "1:487041339748:web:8f756789a6c510cf6c6a71",
  measurementId: "G-KZJEGMBG2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
