
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC8HP_dEj10LWr7bhxagftyWheziuOcDJA",
  authDomain: "arrayan-d3671.firebaseapp.com",
  projectId: "arrayan-d3671",
  storageBucket: "arrayan-d3671.appspot.com",
  messagingSenderId: "230999518645",
  appId: "1:230999518645:web:a2d87f518401c750a57dfc",
  measurementId: "G-LGWN9RSQQC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries