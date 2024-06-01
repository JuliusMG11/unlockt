// ViewEntry.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, firestore, storage, onAuthState } from '../firebase'; 
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

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



 useEffect(() => {
  loadDataFromFirebase();
 }, [userId]);

 if (!entry) return <div>Loading...</div>;

 return (
    <div>
      <h2>View Entry</h2>
      <p>Price: {price}</p>
      <img src={imageUrl} alt="Uploaded" />
    </div>
 );
};

export default ViewEntry;
