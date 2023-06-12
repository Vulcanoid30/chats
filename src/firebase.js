// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCg_surXcaSk-_nBSAneaoQ6UhWdDKMlrg",

  authDomain: "chats-c28b6.firebaseapp.com",

  projectId: "chats-c28b6",

  storageBucket: "chats-c28b6.appspot.com",

  messagingSenderId: "567555599569",

  appId: "1:567555599569:web:51a28a2cf6597abf2169f0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
