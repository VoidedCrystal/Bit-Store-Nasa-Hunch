// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3jvfPKVlBWtgfbrqJcl3SpqjxrfUulkI",
  authDomain: "bit-store-d48f7.firebaseapp.com",
  projectId: "bit-store-d48f7",
  storageBucket: "bit-store-d48f7.firebasestorage.app",
  messagingSenderId: "479438806686",
  appId: "1:479438806686:web:b662729c03ab80d972258f",
  measurementId: "G-BZSC2BG3MP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, app, analytics, db, storage }; 
