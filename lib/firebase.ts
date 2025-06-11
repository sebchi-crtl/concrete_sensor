// lib/firebase.ts
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {  getFirestore, connectFirestoreEmulator, initializeFirestore } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import firebase from "firebase/compat/app";

import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);



// const firebaseConfig = {
//   apiKey: "AIzaSyBXEJyz7Ak6qlq4ygUaEm90Rab6J73NmhE",
//   authDomain: "concretesensor-53a24.firebaseapp.com",
//   // databaseURL: "https://concretesensor-53a24-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "concretesensor-53a24",
//   storageBucket: "concretesensor-53a24.firebasestorage.app",
//   messagingSenderId: "27626902405",
//   appId: "1:27626902405:web:5438add239d846a6582aec",
//   // measurementId: "G-91R9E9CLPX"
// }

// if (!firebase.apps.length){
//   const check = firebase.initializeApp(firebaseConfig)
//   console.log(check)
// }

// export default firebase;

// const firebaseConfig = {
//   apiKey: "AIzaSyBXEJyz7Ak6qlq4ygUaEm90Rab6J73NmhE",
//   authDomain: "concretesensor-53a24.firebaseapp.com",
//   databaseURL: "https://concretesensor-53a24-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "concretesensor-53a24",
//   storageBucket: "concretesensor-53a24.firebasestorage.app",
//   messagingSenderId: "27626902405",
//   appId: "1:27626902405:web:5438add239d846a6582aec",
//   measurementId: "G-91R9E9CLPX"
// };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// analytics.app.automaticDataCollectionEnabled;
// console.log("this is analytics ",analytics);
// export const db = getFirestore(app);

// export const db = getFirestore(app);
// db.settings({
//   experimentalForceLongPolling: true,
//   useFetchStreams: true
// });
// console.log("this is db ",db);


// const auth = getAuth(app);
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     console.log("User signed in:", user.uid);
//     // Now safe to use db
//   } else {
//     console.log("No user signed in");
//   }
// });
