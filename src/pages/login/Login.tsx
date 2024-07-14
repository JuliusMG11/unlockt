import React, { useState } from 'react';
import { auth } from '../../firebase.js';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import 'firebase/auth';
import * as firebase from 'firebase/app';

import { IonButton, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';

import './login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogin = async () => {
        console.log('Login attempt with:', email, password);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push('/main-page');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, new auth.GoogleAuthProvider());
            // After successful authentication, redirect to main page or perform other actions
            history.push('/main-page');
        } catch (error) {
            console.error("Google Login failed:", error);
        }
    };
    return (
        <div>
            <div className="login-container">
                <h2>Login your account</h2>
                <IonInput className='basic-input' type="email" placeholder="Email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
                <IonInput className='basic-input' type="password" placeholder="Password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
                <IonButton onClick={handleLogin}>Login</IonButton>
                <IonButton onClick={googleLogin}>Goggle Login</IonButton>
                <h2>OR</h2>
                {/* <Link to="/register">
                    <IonButton>Register</IonButton>
                </Link> */}
            </div>
        </div>
    );
};

export default Login;
