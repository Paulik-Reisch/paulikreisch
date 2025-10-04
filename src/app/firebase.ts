// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "hallo-welt-paulik-reisch",
  "appId": "1:325771936221:web:b1fa31d5d0778bca947634",
  "apiKey": "AIzaSyDwVpEVuGWPIWNPueW5ZROXAZP044lM_4w",
  "authDomain": "hallo-welt-paulik-reisch.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "325771936221",
  "storageBucket": "hallo-welt-paulik-reisch.appspot.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
