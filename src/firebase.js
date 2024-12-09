import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"; 
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

const firebaseConfig = {
    apiKey: "AIzaSyDP-jBsLk1sfF-NlO6Y4AYUAxUhwF2sKXE",
    authDomain: "uncovered-3c24d.firebaseapp.com",
    projectId: "uncovered-3c24d",
    storageBucket: "uncovered-3c24d.appspot.com",
    messagingSenderId: "115967563639",
    appId: "1:115967563639:web:d56732c8050c33efc1f372",
    measurementId: "G-FXE0LBS1RV"  
};

// const app = initializeApp(firebaseConfig);

// if (Capacitor.isNativePlatform()) {
//     initializeAuth(app, {
//       persistence: indexedDBLocalPersistence
//     });
//   }


const app = initializeApp(firebaseConfig);
if (Capacitor.isNativePlatform()) {
    initializeAuth(app, {
        persistence: indexedDBLocalPersistence
    });
}


export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);