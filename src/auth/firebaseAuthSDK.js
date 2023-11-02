
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const app = firebase.initializeApp({
  apiKey: "AIzaSyC8HP_dEj10LWr7bhxagftyWheziuOcDJA",
    authDomain: "arrayan-d3671.firebaseapp.com",
    projectId: "arrayan-d3671",
    storageBucket: "arrayan-d3671.appspot.com",
    messagingSenderId: "230999518645",
    appId: "1:230999518645:web:a2d87f518401c750a57dfc",
    measurementId: "G-LGWN9RSQQC"
})

export const auth = app.auth()
export default app
