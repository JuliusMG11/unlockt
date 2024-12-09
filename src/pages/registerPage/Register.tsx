import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './register.css';

/* FIREBASE */
import { auth, firestore } from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

/* NOTIFICATION */
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 

/*IONIC COMPONENTS */
import { IonButton } from '@ionic/react';

/* COMPONENTS */
import GlobalLogo from '../../components/Atoms/a-globa-logo/a-global-logo';

const Register = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [nickName, setNickName] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');


const history = useHistory();

// Create an instance of Notyf
const notyf = new Notyf({ position: { x: 'right', y: 'top' } });


 const handleRegister = async () => {
      if (!email || !password || !nickName || password !== confirmPassword) {
        notyf.error('Please fill in all fields and ensure passwords match');
        return; 
    }

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const db = firestore;
      const userRef = doc(db, "users", user.uid);

        // Save the nickname to Firestore
      await setDoc(userRef, {
        personal_info: {
          nick_name: nickName,
          profile_picture: null,
          email: email,
        },
        bank_info: {
          full_name: '',
          iban: '',
        },
        amount_info: {
          total_amount: 0,
          total_fee_amount: 0,
          total_pending_amount: 0,
        }
     
      }, { merge: true });

      history.push('/main-page');

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
    notyf.error('Google registration failed, please try again');
  }
};

 return (
    <div className="register-container">
      <div className="register-header">
        <div className="register-logo">
          <GlobalLogo iconColor="#6A2EFD" textColor="#121212" />
        </div>
        <h2>Register</h2>
      </div>
      <input
        className='register-input' 
        type="text" 
        placeholder="Please enter the nick name" 
        value={nickName} 
        onChange={(e) => setNickName(e.target.value)} 
      />
      <input 
        className='register-input' 
        type="email" 
        placeholder="Please enter the email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        className='register-input' 
        type="password" 
        placeholder="Please enter the password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <input 
        className='register-input' 
        type="password" 
        placeholder="Please repeat the password" 
        value={confirmPassword} 
        onChange={(e) => setConfirmPassword(e.target.value)} 
      />
      <div className="register-buttons">
        <IonButton onClick={handleRegister}>Register account</IonButton>
        <IonButton onClick={googleRegistration}>Register with gmail</IonButton>
      </div>
      <div className="register-footer">
        <p>Do you have an account yet ?</p>
        <a href="/login">Sign in</a>
      </div>
    </div>
 );
};


export default Register;