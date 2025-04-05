
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getDatabase } from 'firebase/database';
import 'firebase/compat/firestore';

const app = firebase.initializeApp({
    apiKey: "AIzaSyC8HP_dEj10LWr7bhxagftyWheziuOcDJA",
    authDomain: "arrayan-d3671.firebaseapp.com",
    projectId: "arrayan-d3671",
    storageBucket: "arrayan-d3671.firebasestorage.app",
    messagingSenderId: "230999518645",
    appId: "1:230999518645:web:a2d87f518401c750a57dfc",
    measurementId: "G-LGWN9RSQQC"
})

export const auth = app.auth()
export const database = getDatabase();
export const firestoreDB = firebase.firestore();
export default app;
export const FieldValue = firebase.firestore.FieldValue;
