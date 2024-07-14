import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';

import Login from './pages/login/Login';
import Register from './pages/Register';
import MainPage from './pages/mainPage/MainPage';
import WalletPage from './pages/walletPage/WalletPage';
import ProfilePage from './pages/profilePage/ProfilePage';
import ViewEntry from './pages/ViewEntry';
import IntroPage from './pages/introPage/IntroPage';

import { auth } from '../src/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './style/Global.css';
import './theme/variables.css';
import './theme/typography.css'
import './style/UI/Button.css';

/* NAVBAR ICONS */
import blurIcon from './assets/icons/blur-icon.svg';
import walletIcon from './assets/icons/wallet-icon.svg';
import profileIcon from './assets/icons/profile-icon.svg';


setupIonicReact();

const App: React.FC = () => {


  const [userValue, setUser] = useState();
  const [showNavigation, setShowNavigation] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setShowNavigation(true);
      } else {
        setShowNavigation(false);
      }
    });

    return () => unsubscribe();
  }, []);

return (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {/* <Route exact path="/">
            <Redirect to="/login"  />
          </Route> */}
          <Route exact path="/" component={IntroPage} />
          <Route path="/view/:id/:postId" component={ViewEntry} />
          <Route path="/register"component={Register} />
          <Route path="/login" component={Login} />
         
          {/* <Route exact path="/login">
            <Login />
          </Route> */}
          <Route exact path="/main-page">
            <MainPage />
          </Route>
          <Route exact path="/wallet-page">
            <WalletPage />
          </Route>
          <Route exact path="/profile-page">
            <ProfilePage />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="MainPage" href="/main-page">
            <div className="icon">
              <img src={blurIcon} alt="" />
            </div>
          </IonTabButton>
          <IonTabButton tab="WalletPage" href="/wallet-page">
            <div className="icon">
              <img src={walletIcon} alt="" />
            </div>
          </IonTabButton>
          <IonTabButton tab="ProfilePage" href="/profile-page">
            <div className="icon">
              <img src={profileIcon} alt="" />
            </div>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  )
};

export default App;
