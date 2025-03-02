// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1GVAGSeP73TPs3fgFrkLtxZjESCPta3E",
  authDomain: "intellgencecheckbuzzer.firebaseapp.com",
  databaseURL: "https://intellgencecheckbuzzer-default-rtdb.firebaseio.com",
  projectId: "intellgencecheckbuzzer",
  storageBucket: "intellgencecheckbuzzer.appspot.com", // ✅ Fixed storageBucket
  messagingSenderId: "467274215067",
  appId: "1:467274215067:web:c12a6e515e69e9b702e03e",
  measurementId: "G-CTDW2EJBQ6",
};

// ✅ Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Initialize Firestore
const analytics = getAnalytics(app); // ✅ Initialize Analytics

// ✅ Export Firestore & Analytics for use in other files
export { db, analytics };