import firebase from 'firebase';

const firebaseApp = firebase.initializeApp( {
  apiKey: "AIzaSyAv2IMNDR6XSwSX0KCp27l1lOsruPsfrws",
  authDomain: "noteswebclone.firebaseapp.com",
  projectId: "noteswebclone",
  storageBucket: "noteswebclone.appspot.com",
  messagingSenderId: "815064531464",
  appId: "1:815064531464:web:27958b312127e7eca607bd",
  measurementId: "G-H7YL307JRE"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();	

export {db, auth};