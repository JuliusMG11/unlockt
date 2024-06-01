import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
        nickname: nickName,
        credit: 0,
     
      }, { merge: true });

    } catch (error) {
      console.error("Registration failed:", error);
    }
 };

 return (
    <div>
      <h2>Register</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Name" value={nickName} onChange={(e) => setNickName(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
 );
};

export default Register;