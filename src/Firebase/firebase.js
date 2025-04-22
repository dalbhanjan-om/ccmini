// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFFyWwTwMfZMn4HKq5lX7QKVAjOR-B8dk",
  authDomain: "food-19e08.firebaseapp.com",
  projectId: "food-19e08",
  storageBucket: "food-19e08.firebasestorage.app",
  messagingSenderId: "859921332356",
  appId: "1:859921332356:web:5b16287f0d2550f6316ad1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
