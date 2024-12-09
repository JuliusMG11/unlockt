import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from '../../firebase';
import { doc, onSnapshot, collection } from "firebase/firestore";
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonContent, IonPage, IonButton, IonModal } from '@ionic/react';
import './ProfilePage.css';


import avatar from '../../assets/icons/profile-avatar.svg'
import { formatPrice } from '../../utyls/formatPrice';
import { formatDate } from '../../utyls/formatDate';


// Define the UserData interface
interface UserData {
  personal_info?: {
    nick_name?: string,
    profile_picture?: string | null,
    email?: string,
  },
  bank_info?: {
    full_name?: string,
    iban?: string,
  },
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({});
  const db = firestore;
  const history = useHistory();
  const unsubscribeSnapshotRef = useRef<() => void>(() => {});

  const [transactions, setTransactions] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openModal = (content: JSX.Element) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };


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


  const fetchTransactions = async (userId: string) => {
    const transactionsRef = collection(db, "users", userId, "transactions"); // Predpokladaná cesta k transakciám
    onSnapshot(transactionsRef, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(fetchedTransactions);
    });
  };


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        // Listen for real-time updates to the user's document
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTransactions(user.uid);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="profile-page">
          <div className="logout-btn">
            <IonButton onClick={logOutUser}>
              logout
            </IonButton>
          </div>
          {userData.personal_info?.profile_picture ? (
            <div className="profile-page_avatar_image">
              <img src={userData.personal_info?.profile_picture} alt="" />
            </div>
          ) : (
            <div className="profile-page_avatar_image">
              <img src={avatar} alt="" />
            </div>
          )}
          <div className="profile-page--accordion">
            <IonButton onClick={() => openModal(
              <div className="profile--page__personal-info">
                <p>Nick name: <strong>{userData.personal_info?.nick_name}</strong></p>
                <p>Email: <strong>{userData.personal_info?.email}</strong></p>
              </div>
            )}>
              Personal Information
            </IonButton>
            <IonButton onClick={() => openModal(
              <div className="profile-page-information__bank-info">
                <p>Full name: <strong>{userData?.bank_info?.full_name}</strong></p>
                <p>IBAN: <strong>{userData?.bank_info?.iban}</strong></p>
              </div>
            )}>
              Bank Info
            </IonButton>
            <IonButton onClick={() => openModal(
              <div className="profile-page-information__transactions">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div className='pending-transaction-list__item' key={transaction.id}>
                      <div className="pending-transaction-list__item-info">
                        <div className="pending-transaction-list__item-info__id">
                          ID: {transaction.id}
                        </div>
                        <div className="pending-transaction-list__item-info__date">
                          Date:  <strong>{formatDate(transaction.createdAt)}</strong>
                        </div>
                        <div className="pending-transaction-list__item-info__status">    
                          Status: <span className="status-green">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                      <div className="pending-transaction-list__item-amount">
                        <div className="">
                          <h4>Price: {formatPrice(transaction.price)}</h4>
                        </div>
                        <div className="">
                          <h4>Fee price: {formatPrice(transaction.fee_price)}</h4>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No transactions available.</p>
                )}
              </div>
            )}>
              Transactions
            </IonButton>
          </div>
          <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
            <IonContent>
              {modalContent}
              <IonButton onClick={closeModal}>Close</IonButton>
            </IonContent>
          </IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
