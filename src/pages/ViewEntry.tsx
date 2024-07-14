// ViewEntry.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, firestore, storage, onAuthState } from '../firebase'; 
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";


import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';


import './ViewEntry.css'

const ViewEntry = () => {
 const [entry, setEntry] = useState(false);
 const [price, setPrice] = useState("");
 const [imageUrl, setImageUrl] = useState("");

 const urlParts = window.location.href.split("/");

  // The user ID is the second element in the array (index 2)
  const userId = urlParts[4];

  // The post ID is the third element in the array (index 3)
  const postId = urlParts[5];


  const db = firestore;
  const loadDataFromFirebase = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", userId, "posts", postId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          console.log("User data:", userDocSnap.data());
          setPrice(userDocSnap.data().price);
          setImageUrl(userDocSnap.data().blurImageUrl);
          setEntry(true)
        } else {
          console.log("No such document!");
        }
      }
    });
  
  } 

  const addPrice = async () => {
    try {
      // Reference to the user's document
      const userDocRef = doc(db, "users", userId);
      // Get the user's document
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const currentTotalAmount = userData.total_ammount || 0; // Get the current total_amount, default to 0 if not set
        const newTotalAmount = currentTotalAmount + Number(price); // Add the price to the current total_amount

        // Update the user's document with the new total_amount
        await updateDoc(userDocRef, { total_ammount: newTotalAmount });

        console.log(`Total amount updated to: ${newTotalAmount}`);
      } else {
        console.log("User document does not exist!");
      }
    } catch (error) {
      console.error("Error updating total amount: ", error);
    }
  };



 useEffect(() => {
  loadDataFromFirebase();
 }, [userId]);

 if (!entry) return <div>Loading...</div>;

 return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>View Entry</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">View wntry</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className='view-entry-section'>
        <h2>View Entry</h2>
        <p>Price: {price}</p>
        <IonButton onClick={addPrice}>BUY</IonButton>
        <p>{imageUrl}</p>
        <img src={imageUrl} alt="Uploaded" />
      </div>
    </IonContent>
  </IonPage>
  );
};

export default ViewEntry;
