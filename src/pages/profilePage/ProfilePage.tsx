import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from '../../firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './ProfilePage.css';

// Define the UserData interface
interface UserData {
  // Optional because it might not be set for every user
  nick_name?: string,
  total_ammount?: number,
  // Add other fields as necessary
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({});
  const db = firestore;
  const history = useHistory();
  const unsubscribeSnapshotRef = useRef<() => void>(() => {});

  // LOGOUT USER
  const logOutUser = async () => {
    // Unsubscribe from Firestore snapshot
    if (unsubscribeSnapshotRef.current) {
      unsubscribeSnapshotRef.current();
    }
    // Sign out the user
    signOut(auth).then(() => {
      // Sign-out successful.
      setUserData({});
      history.push('/');
    }).catch((error: string) => {
      // An error happened.
      console.log(error);
    });
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        // Listen for real-time updates to the user's document
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData); // Cast the fetched data to UserData
            console.log("Document data:", docSnap.data());
          } else {
            console.log("No such document!");
          }
        });

        // Store the unsubscribe function in the ref
        unsubscribeSnapshotRef.current = unsubscribeSnapshot;
      }
    });

    // Cleanup listeners on unmount
    return () => {
      if (unsubscribeSnapshotRef.current) {
        unsubscribeSnapshotRef.current();
      }
      unsubscribeAuth();
    };
  }, [db]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ProfilePage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <ExploreContainer name="Tab 3 page" /> */}
        <div className="avatar-image">
          <img src={userData.avatar_image_url} alt="" />
        </div>
        <h2>{userData.nick_name ? userData.nick_name : userData.email}</h2>
        <h2>Total amount: {userData.total_ammount ? userData.total_ammount : "0" }</h2>
        <div className="">
          <IonButton onClick={logOutUser}>
            Logout user
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
