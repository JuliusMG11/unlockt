import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from '../../firebase';
import { doc, getDoc, onSnapshot, collection, setDoc } from "firebase/firestore";
import { IonContent, IonPage, IonButton, IonModal, IonInput } from '@ionic/react';

import { formatDate } from '../../utyls/formatDate';
import { formatPrice } from '../../utyls/formatPrice';

import TitleHeader from '../../components/Moleculas/m-title-header/m-title-header';

import './WalletPage.css';
import './WalletPagePopup.css';


// TODO


interface UserData {
  personal_info?: {
    nick_name?: string,
  };
  amount_info?: {
    total_amount?: number,
    total_fee_amount?: number,
    total_pending_amount?: number,
  };
}
const WalletPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const db = firestore;
  const unsubscribeSnapshotRef = useRef<() => void>(() => {});

  const [loading, setLoading] = useState<boolean>(true);

  const [isCashoutDisabled, setIsCashoutDisabled] = useState<boolean>(true);

  // PENDING TRANSACTIONS
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);

  // SET BANK INFO DATA AND POPUP
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [iban, setIban] = useState<string>('');


  const fetchUserData = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData(data);
    } else {
      setUserData(undefined);
    }
    setLoading(false);
  };

  const requestCashout = async () => {
    if (!userData) return;

    if (!userData.bank_info?.full_name || !userData.bank_info?.iban) {
      setShowPopup(true);
      return;
    }
  
    const userId = auth.currentUser?.uid; // Získanie ID používateľa
    const pendingTransactionRef = doc(collection(db, "users", userId, "pending_transactions"));
    
    // Vytvorenie novej transakcie
    await setDoc(pendingTransactionRef, {
      amount_fee: userData?.amount_info?.total_fee_amount,
      amount: userData?.amount_info?.total_amount,
      status: "pending",
      createdAt: new Date().toISOString(), // Aktuálny dátum
    });
  
    // Aktualizácia údajov používateľa
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      amount_info: {
        total_fee_amount: 0,
        total_amount: 0,
        total_pending_amount: userData?.amount_info?.total_fee_amount,
      },
    }, { merge: true });

    setIsCashoutDisabled(true);
  };

  const handleSave = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, {
        bank_info: {
          full_name: fullName,
          iban: iban,
        },
      }, { merge: true });
      setShowPopup(false);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
        setUserData({});
      }
    });

    // Real-time listener for user data
    const userId = auth.currentUser?.uid;
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      unsubscribeSnapshotRef.current = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUserData(data);
        } else {
          setUserData(undefined);
        }
      });
    }

    // Cleanup listeners on unmount
    return () => {
      if (unsubscribeSnapshotRef.current) {
        unsubscribeSnapshotRef.current();
      }
      unsubscribeAuth();
    };
  }, [db]);

  // useEffect(() => {
  //   console.log('userData', userData);
  // }, [userData]);

  useEffect(() => {
    if(userData?.amount_info?.total_amount === 0 || (userData?.amount_info?.total_amount !== undefined && userData?.amount_info?.total_amount < 20))  {
      setIsCashoutDisabled(true);
    } else {
      setIsCashoutDisabled(false);
    }
  }, [userData?.amount_info?.total_amount]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const pendingTransactionsRef = collection(db, "users", userId, "pending_transactions");
      const unsubscribePendingTransactions = onSnapshot(pendingTransactionsRef, (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingTransactions(transactions);
      });
  
      // Cleanup listener on unmount
      return () => {
        unsubscribePendingTransactions();
      };
    }
  }, [db]);

  return (
     <IonPage>
    <IonContent fullscreen>
      <TitleHeader title='Wallet' />
      <div className="container wallet-page">
        {loading ? ( 
          <h3 style={{ color: "#121212" }}>Loading...</h3>
        ) : (
        ( userData!! && 
          <>
            <h3>
              { userData?.amount_info?.total_fee_amount ? formatPrice(userData.amount_info.total_fee_amount) : "0$" }
            </h3>
            <h4>{ userData.personal_info?.nick_name }</h4>
            <div className="wallet-page-count">
            <div className="wallet-page-count__item">
                <span>Available to cashout</span>
                <h4>
                  {userData?.amount_info?.total_fee_amount ? formatPrice(userData.amount_info.total_fee_amount) : "0$"}
                </h4>
              </div>
              <div className="wallet-page-count__item">
                <span>Pending</span>
                <h4>{ userData?.amount_info?.total_pending_amount ? formatPrice(userData.amount_info.total_pending_amount) : "0$" }</h4>
              </div>
            </div>
            <IonButton
                disabled={isCashoutDisabled}
                onClick={requestCashout}
              >
                Request cashout
            </IonButton>

            <IonModal
              className='wallet-page-popup'
              isOpen={showPopup} 
              onDidDismiss={() => setShowPopup(false)}
            >
              <div className='wallet-page-popup__content'>
                <h2>Fill in your bank information</h2>
                <input
                  value={fullName} 
                  placeholder="Full Name" 
                  onChange={e => setFullName(e.target.value!)} 
                />
                <input
                  value={iban} 
                  placeholder="IBAN" 
                  onChange={e => setIban(e.target.value!)} 
                />
                <IonButton 
                  onClick={handleSave} 
                  disabled={!fullName || !iban} 
                >
                  Save
                </IonButton>
                <IonButton onClick={() => setShowPopup(false)}>Cancel</IonButton>
              </div>
            </IonModal>
            
            <div className="penging-transaction">
              <h3>Pending transactions</h3>
              <div className="pending-transaction-list">
                {pendingTransactions.length > 0 ? (
                  pendingTransactions.map(transaction => (
                    <div className='pending-transaction-list__item' key={transaction.id}>
                      <div className="pending-transaction-list__item-info">
                       <div className="pending-transaction-list__item-info__id">
                        ID: {transaction.id}
                       </div>
                       <div className="pending-transaction-list__item-info__date">
                          Date:  <strong>{formatDate(transaction.createdAt)}</strong>
                        </div>
                        <div className="pending-transaction-list__item-info__status">    
                        Status: <span 
                            className={transaction.status === 'approved' ? 'status-green' : 'status-orange'}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                      <div className="pending-transaction-list__item-amount">
                        <h4>{formatPrice(transaction.amount)}</h4>
                      </div>
                    </div>
                  ))
                ) : (
                  <h4>No pending transactions</h4>
                )}
              </div>
            </div>
          </> )
        )}
      </div>
    </IonContent>
  </IonPage>
  );
};

export default WalletPage;
