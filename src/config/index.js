// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgLgtP1PWzAA9mK6LtkL_9FVuoClLcAog",
  authDomain: "skripsi-ady.firebaseapp.com",
  databaseURL: "https://skripsi-ady-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "skripsi-ady",
  storageBucket: "skripsi-ady.appspot.com",
  messagingSenderId: "392072219376",
  appId: "1:392072219376:web:6166e34e1a3b86bc8ed035"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app