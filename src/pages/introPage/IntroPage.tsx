import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './IntroPage.css';

const IntroPage: React.FC = () => {
  const history = useHistory();

  const goLoginPage = () => {
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>INTRO PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="login-container">
          <IonButton href="/login">Login</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IntroPage;
