import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton } from '@ionic/react';
import { useHistory, Link  } from 'react-router-dom';
import './IntroPage.css';
import introBg from '../../assets/img/intro-page-bg.jpg';

/* FIREBASE */
import 'firebase/auth';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase.js';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";


/* COMPONENTS */
import GlobalLinkBtn from '../../components/Atoms/a-global-link-btn/a-global-link-btn';
import GlobalLogo from '../../components/Atoms/a-globa-logo/a-global-logo';


/* ICONS */
// import googleIcon from '../../assets/svg/google-logo.svg';

import notyf from '../../utyls/notyfConfig'; 

const IntroPage: React.FC = () => {
  // LOGIN EMAIL
  const [email, setEmail] = useState('');
  // LOGIN PASSWORD
  const [password, setPassword] = useState('');
  const history = useHistory();

  const goRegisterPage = () => {
    history.push('/register');
  };

  // LOGIN FUNCTION
  const handleLogin = async () => {
      console.log('Login attempt with:', email, password);
      try {
          await signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            history.push('/main-page');
          })
      } catch (error: any) {
        const errorCode = error.code;
        console.log(errorCode);
    
        switch (errorCode) {
          case 'auth/invalid-email':
            notyf.error('Invalid email format. Please check and try again.');
          break;

          case 'auth/missing-password':
            notyf.error('Missing password.');
          break;

          case 'auth/invalid-credential':
            notyf.error('Invalid email or password.');
          break;
        }
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

  const facebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider(); // Create Facebook Auth Provider
      const result = await signInWithPopup(auth, provider);
      // After successful authentication, redirect to main page or perform other actions
      history.push('/main-page');
    } catch (error) {
      console.error("Facebook Login failed:", error);
    } 
  }

  const linkStyle = {
    margin: "1rem",
    textDecoration: "none",
    color: 'blue'
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="intro-page-container">
          <div className="intro-page-bg">
            <img src={introBg} alt="" />
          </div>
          <div className="intro-page-content">
            <div className="intro-logo">
               <GlobalLogo iconColor="#fff" textColor="#fff" />
            </div>
            <div className="intro-title">
              <h1>
                Earn from Every Creation Engage with Your Fans
              </h1>
            </div>

            <div className="a-global-input mb-4">
              <input
                placeholder='Email'
                type="text"
                value={email} 
                onChange={e => setEmail(e.target.value!)}
                className='a-global-input'
              />
            </div>
            <div className="a-global-input">
              <input
                className='a-global-input' 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value!)} 
              />
            </div>
            <IonButton onClick={handleLogin}>Login</IonButton>
            <IonButton className="flex items-center gap-2" onClick={googleLogin}>
                Goggle Login
              </IonButton>
            <IonButton onClick={facebookLogin}>Facebook Login</IonButton>  
              <div className="intro-page-register">
                <h2>
                  Dont have a account?
                  <Link 
                    className=""
                    to="/register">
                    Sign up
                  </Link>
                </h2>
              </div>
              
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IntroPage;
