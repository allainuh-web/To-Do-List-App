// src/firebase/firebaseConfig.js
// Firebase configuration using your project credentials.
// Firestore is used for storing tasks.
// Analytics is optional — safe to keep or remove.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKiQv63GvpLKK9nANWlbUgQOB8AikDBxw",
  authDomain: "to-dolist-app-31aed.firebaseapp.com",
  databaseURL: "https://to-dolist-app-31aed-default-rtdb.firebaseio.com",
  projectId: "to-dolist-app-31aed",
  storageBucket: "to-dolist-app-31aed.firebasestorage.app",
  messagingSenderId: "25882861225",
  appId: "1:25882861225:web:c152377d43fa314bd1d3b8",
  measurementId: "G-VH3S4V02TC",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize and export Firestore — this is what HomeScreen.js imports
export const db = getFirestore(app);
