import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDP-jBsLk1sfF-NlO6Y4AYUAxUhwF2sKXE",
    authDomain: "uncovered-3c24d.firebaseapp.com",
    projectId: "uncovered-3c24d",
    storageBucket: "uncovered-3c24d.appspot.com",
    messagingSenderId: "115967563639",
    appId: "1:115967563639:web:d56732c8050c33efc1f372",
    measurementId: "G-FXE0LBS1RV"  
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);