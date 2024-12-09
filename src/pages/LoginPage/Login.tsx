import React, { useState } from 'react';
import { auth } from '../../firebase.js';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import 'firebase/auth';
import * as firebase from 'firebase/app';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

import { IonButton, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';

import './login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const notyf = new Notyf();
    const handleLogin = async () => {
        console.log('Login attempt with:', email, password);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push('/main-page');
        } catch (error: any) {
            console.error(error.code);
        }
    };
    
    const googleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider(); // Create Google Auth Provider using firebase object directly
            const result = await signInWithPopup(auth, provider);
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
