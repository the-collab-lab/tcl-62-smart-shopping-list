import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvYgObnFq98awvuWz9AJFepEqr7Q_lZS0",
  authDomain: "tcl-62-smart-shopping-list.firebaseapp.com",
  projectId: "tcl-62-smart-shopping-list",
  storageBucket: "tcl-62-smart-shopping-list.appspot.com",
  messagingSenderId: "942770656177",
  appId: "1:942770656177:web:67736332ec613474dd6390"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
