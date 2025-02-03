<<<<<<< HEAD
<<<<<<< HEAD
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
  measurementId: "G-CTDW2EJBQ6"
=======
=======
>>>>>>> 2fdd0b18e5b32b9cb680ebc3af13c8f9e7291d08
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
<<<<<<< HEAD
>>>>>>> 2fdd0b18e5b32b9cb680ebc3af13c8f9e7291d08
=======
>>>>>>> 2fdd0b18e5b32b9cb680ebc3af13c8f9e7291d08
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
<<<<<<< HEAD
<<<<<<< HEAD
const db = getFirestore(app); // ✅ Initialize Firestore
const analytics = getAnalytics(app);

// Export Firestore so other files can use it
export { db, analytics };
=======
const db = getFirestore(app);

export { db };
>>>>>>> 2fdd0b18e5b32b9cb680ebc3af13c8f9e7291d08
=======
const db = getFirestore(app);

export { db };
>>>>>>> 2fdd0b18e5b32b9cb680ebc3af13c8f9e7291d08
