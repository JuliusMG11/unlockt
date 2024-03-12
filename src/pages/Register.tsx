import React, { useState } from 'react';
import { auth } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 // const authVerification = auth

 const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Navigate to the home page or dashboard after registration
    } catch (error) {
      console.error("Registration failed:", error);
    }
 };

 return (
    <div>
      <h2>Register</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
 );
};

export default Register;