import React, { useState } from 'react';
import { auth } from '../firebase.js';
import {signInWithEmailAndPassword} from "firebase/auth";
import { IonButton } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

 const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.push('/tab1');
      // Navigate to the home page or dashboard after login
    } catch (error) {
      console.error("Login failed:", error);
    }
 };

 return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <h2>OR</h2>
      <Link to="/register">
        <IonButton>Register</IonButton>
      </Link>
    </div>
 );
};

export default Login;