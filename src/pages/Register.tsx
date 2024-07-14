import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { IonButton } from '@ionic/react';


const Register = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [nickName, setNickName] = useState('');
 // const authVerification = auth

 const handleRegister = async () => {
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const db = firestore;
      const userRef = doc(db, "users", user.uid);

        // Save the nickname to Firestore
      await setDoc(userRef, {
        nick_name: nickName,
        total_ammount: 0
     
      }, { merge: true });

    } catch (error) {
      console.error("Registration failed:", error);
    }
 };

 

 const googleRegistration = async () => {
  const provider = new GoogleAuthProvider();
  try {
    // Perform sign-in with Google
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Fetch user's email and avatar image URL
    const userEmail = user.email; // User's email
    const userAvatarUrl = user.photoURL; // User's avatar image URL

    const db = firestore;
    const userRef = doc(db, "users", user.uid);

    // Include email and avatar image URL in the document
    await setDoc(userRef, {
      nick_name: nickName,
      total_amount: 0,
      email: userEmail, // Set user's email
      avatar_image_url: userAvatarUrl, // Set user's avatar image URL
    }, { merge: true });
  } catch (error) {
    console.error("Google registration failed:", error);
  }
};

 return (
    <div>
      <h2>Register</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Name" value={nickName} onChange={(e) => setNickName(e.target.value)} />
      <div className="">
        <IonButton onClick={handleRegister}>Register</IonButton>
        <IonButton onClick={googleRegistration}>Register with gmail</IonButton>
      </div>
    </div>
 );
};

export default Register;