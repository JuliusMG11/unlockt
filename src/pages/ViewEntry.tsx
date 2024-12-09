// ViewEntry.js
import React, { useState, useEffect, useRef } from 'react';
// STRIPE
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { useParams } from 'react-router-dom';
import { auth, firestore, storage, onAuthState } from '../firebase'; 
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

import { IonContent, IonPage, IonButton } from '@ionic/react';

import './ViewEntry.css'

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

import audioIcon from '../assets/icons/music-icon.svg';
import documentIcon from '../assets/icons/document-icon.svg';

const stripePromise = loadStripe('pk_test_51QHQO7BU3nCGItWdNCJ75EY7ULltD5m2kzq58vcWPKwJ2NR7BuSHE9x6ZhpK1nF0Bk1ukruEkIJ0gAoa8G9Q1NuV002NMWPOoE');

// TODO
// -- pridat download button po zaplateni, na stiahnuti vsektych typov suborov

const ViewEntry = () => {
 const [entry, setEntry] = useState(false);

 const [postData, setPostData] = useState<any | undefined>(undefined);

 // PAYMENT STATUS
 const [payStatus, setPayStatus] = useState(false);

 // STRIPE
 const stripe = useStripe();
const elements = useElements();
const [processing, setProcessing] = useState(false);
const [error, setError] = useState<string | null>(null);

// VIDEO STATE
const videoRef = useRef<HTMLVideoElement>(null);

// TIMER STATE
const [createdAt, setCreatedAt] = useState<number | null>(null);
const [timeLeft, setTimeLeft] = useState<number>(0);

 const urlParts = window.location.href.split("/");

  // The user ID is the second element in the array (index 2)
  const userId = urlParts[4];

  // The post ID is the third element in the array (index 3)
  const postId = urlParts[5];

  const db = firestore;
  const loadDataFromFirebase = async () => {
    // LOAD OWNER DATA
    const ownerDocRef = doc(db, "users", userId);
    const ownerDocSnap = await getDoc(ownerDocRef);
    console.log('owner data', ownerDocSnap.data());

    // LOAD USER POST DATA
    const userDocRef = doc(db, "users", userId, "posts", postId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
  
      setPostData(userDocSnap.data());
      setEntry(true);

      if (userDocSnap.data()) {
        setCreatedAt(userDocSnap.data().createdAt);

        const now = new Date();
        const expirationTime = new Date(userDocSnap.data().createdAt);
        expirationTime.setHours(expirationTime.getHours() + 24);
        setTimeLeft(Math.max(0, expirationTime.getTime() - now.getTime()));
      }
    } else {
      console.log("No such document!");
    }
  };



  const updateNewValues = async () => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const currentTotalamount = userData.amount_info?.total_amount || 0;
        const currentTotalFeeamount = userData.amount_info?.total_fee_amount || 0;
        
        await updateDoc(userDocRef, {
          'amount_info.total_amount': currentTotalamount + Number(postData?.price),
          'amount_info.total_fee_amount': currentTotalFeeamount + Number(postData?.fee_price)
        });
        

        // UPDATE POST SHOW IMAGE COUNTER
        const postDocRef = doc(db, "users", userId, "posts", postId);
        const postDocSnap = await getDoc(postDocRef);
        
        if (postDocSnap.exists()) {
          const currentCounter = postDocSnap.data().counter_show_image || 0;
          await updateDoc(postDocRef, {
            counter_show_image: currentCounter + 1
          });
        }
      } else {
        console.log("User document does not exist!");
      }
    } catch (error) {
      console.error("Error updating total amount: ", error);
    }
  };

  const createTransaction = async () => {
    const transactionRef = doc(collection(db, "users", userId, "transactions"));
    await setDoc(transactionRef, {
        price: Number(postData?.price),
        fee_price: Number(postData?.fee_price),
        type: "post_payment",
        status: "completed",
        createdAt: new Date().toISOString(),
    });
};

  const payForFile = async () => {
    try {
      setProcessing(true);
      setError(null);
  
      const response = await fetch('https://us-central1-uncovered-3c24d.cloudfunctions.net/createPaymentIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: postData?.price * 100,
          currency: 'usd',
          customer: userId
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }  
  
      const data = await response.json();

      if (!data.clientSecret) {
        throw new Error('No client secret received from the server');
      }  

      const clientSecret = data.clientSecret;
  
      const cardElement = elements?.getElement(CardElement);
  
      if (!stripe || !cardElement) {
        throw new Error('Stripe not initialized');
      }
  
      const { paymentIntent, error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
  
      if (paymentError) {
        throw new Error(paymentError.message);
      }
  
      if (paymentIntent.status === 'succeeded') {
        
        await updateNewValues();
        await createTransaction();

        setPayStatus(true);
        console.log('Payment successful');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error?.message || 'An error occurred while processing the payment');
      setPayStatus(false);
    } finally {
     setProcessing(false);
    }
  };
  


 useEffect(() => {
  loadDataFromFirebase();
 }, [userId]);

 useEffect(() => {
  console.log('user data', postData);
}, [postData]);

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => Math.max(0, prev - 1000)); 
  }, 1000);

  return () => clearInterval(timer);
}, []);


 if (!entry) return <div>Loading...</div>;

 return (
    <IonPage>
    <IonContent fullscreen>
      <div className='view-entry-section'>
        <div className="view-entry-timer__content">
          {timeLeft > 0 ? ( 
              <div className="view-entry-timer__content--timer">
                <h4>{Math.floor(timeLeft / (1000 * 60 * 60))}h</h4>
                <h4>{Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))}m</h4>
                <h4>{Math.floor((timeLeft % (1000 * 60)) / 1000)}s</h4>
              </div>
            ) : (
              <h4>Prispevok vyexpiroval</h4> 
            )}
            {/* <p>FEE price: {postData?.fee_price}</p> */}
          </div>
        {postData?.image_url && !postData?.is_video && !postData?.is_sound && !postData?.is_document ? (
         (postData!! && 
          <div className="view-entry-section__image-section">
            <img src={payStatus ? postData?.image_url : postData?.blur_image_url} alt="Uploaded" />
            {payStatus && (
              <a 
                href={postData?.image_url} 
                target='_blank' 
                download 
                className="download-btn"
              >
                Download Image
              </a>
            )}
          </div>
         )
        ) : null}

        {postData?.is_video ? (
          <div className='m-post-page__image-content--video'>
                
            <div className="video">
                {!payStatus ? (
                  <div className="thumbnail">
                    <img src={postData?.blur_image_url} alt="Video thumbnail" />
                  </div>
                ) : (
                  <video ref={videoRef} width="320" height="240" controls>
                    <source src={postData?.video_url} type="video/mp4" />
                  </video>
                )}
                {payStatus && (
                <a 
                  href={postData?.video_url} 
                  target='_blank' 
                  download 
                  className="download-btn"
                >
                  Download Video
                </a>
              )}
            </div>
     
          </div>
        ) : null}

        {postData?.is_sound ? (
          <div className='m-view-entry__image-content--sound'>
            <div className="m-view-entry__image-content--sound__image">
              <img src={audioIcon} alt="" />
              <p>{postData?.sound_name}</p>
            </div>
            
            {payStatus ? (
              <audio src={postData?.sound_url} controls></audio>
            ) : null }
          </div>
        ): null }

        {postData?.is_document ? (
          <div className='m-view-entry__image-content--document'>
            <div className="m-view-entry__image-content--document__image">
              <img src={documentIcon} alt="" />
              <p>{postData?.document_name}</p>
            </div>
            {payStatus ? (
              <div className="m-view-entry__image-content--document__download">
                <a 
                  href={postData?.document_url}
                  target='_blank' 
                  download 
                  className="download-btn"
                >
                  Download document
                </a>
              </div>
            ): null }
          </div>
        ) : null }

        <div className="view-entry-section__content">
          <div className="view-entry-section__content--price">
            <h3>{postData?.price}$</h3>
          </div>
        </div>
        {timeLeft > 0 ? ( 
        <div className="payment-section">
        {stripe && elements ? ( // Pridajte podmienku na zobrazenie CardElement
            <CardElement 
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          ) : (
            <div>Loading payment form...</div> // Zobrazte správu, kým sa načítava
          )}
           {postData?.is_sound && payStatus && (
               <a 
               href={postData?.sound_url} 
               className="download-btn"
             >
               Download Audio
             </a>
            )}
            <IonButton 
              onClick={payForFile} 
              disabled={!stripe || processing || payStatus}
              className='payment-btn'
            >
              {processing ? 'IN PROGRESS...' : payStatus ? 'ZAPLATENÉ' : 'BUY'}
            </IonButton>
            {error && <div className="error-message">{error}</div>}
        </div>
        ) : null }
      </div>
    </IonContent>
  </IonPage>
  );
};

const WrappedViewEntry = () => (
  <Elements stripe={stripePromise}>
    <ViewEntry />
  </Elements>
);

export default WrappedViewEntry;
