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


/* LOGIN AND REGISTER */
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';

/* MAIN TAB NAVIGATION */
import MainPage from './pages/MainPage/MainPage';
import WalletPage from './pages/WalletPage/WalletPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ViewEntry from './pages/ViewEntry';
import IntroPage from './pages/IntroPage/IntroPage';

import PostsPage from './pages/PostsPage/PostsPage'
import PostPage from './pages/PostPage/PostPage'

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
import './style/Atoms/Button.css'

/* NAVBAR ICONS */
import blurIcon from './assets/icons/blur-icon.svg';
import walletIcon from './assets/icons/wallet-icon.svg';
import profileIcon from './assets/icons/profile-icon.svg';
import postsIcon from './assets/icons/posts-icon.svg';


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
        <Route path="/register" component={Register} />
        <Route exact path="/" component={IntroPage} />
        <Route path="/view/:id/:postId" component={ViewEntry} />
        
        {showNavigation ? (
          <>
            {location.pathname.startsWith('/view/') ? null : <Redirect to="/main-page" />}
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/post/:id" component={PostPage} />
                <Route path="/login" component={Login} />
                <Route exact path="/main-page">
                  <MainPage />
                </Route>
                <Route exact path="/wallet-page">
                  <WalletPage />
                </Route>
                <Route exact path="/profile-page">
                  <ProfilePage />
                </Route>
                <Route exact path="/posts-page">
                  <PostsPage />
                </Route>
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="MainPage" href="/main-page">
                  <div className="icon">
                    <img src={blurIcon} alt="" />
                  </div>
                </IonTabButton>
                <IonTabButton tab="PostsPage" href="/posts-page">
                  <div className="icon">
                    <img src={postsIcon} alt="" />
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
          </>
        ) : (
          <>
           {location.pathname.startsWith('/view/') ? (
              <Route path="/view/:id/:postId" component={ViewEntry} />
            ) : (
              <Route exact path="/" component={IntroPage} />
            )}
          </>
        )}
      </IonReactRouter>
  </IonApp>
  )
};

export default App;
