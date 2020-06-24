import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwYoewinhhNmHT2bQYk4GsAelhXay49f0",
  authDomain: "onicares-6b369.firebaseapp.com",
  databaseURL: "https://onicares-6b369.firebaseio.com",
  projectId: "onicares-6b369",
  storageBucket: "onicares-6b369.appspot.com",
  messagingSenderId: "545678682203",
  appId: "1:545678682203:web:aa96c7caebdad293fc377e",
  measurementId: "G-TEF2KX8NJD"
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
export const db = baseDb;
export default firebase;