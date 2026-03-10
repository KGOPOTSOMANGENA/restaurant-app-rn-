// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDRrpjJVauvshLNw62dHZn_6aaBc9VHQAg",
  authDomain: "restaurantapp-d3bde.firebaseapp.com",
  projectId: "restaurantapp-d3bde",
  storageBucket: "restaurantapp-d3bde.appspot.com",
  messagingSenderId: "562126713220",
  appId: "1:562126713220:web:c5059b7cd85746006dedd1"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const now = () => serverTimestamp();
