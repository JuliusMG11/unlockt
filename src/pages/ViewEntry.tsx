// ViewEntry.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';

const ViewEntry = () => {
 const [entry, setEntry] = useState(null);
 const { id } = useParams();

 useEffect(() => {
    const fetchData = async () => {
      const doc = await firestore.collection('entries').doc(id).get();
      if (doc.exists) {
        setEntry(doc.data());
      }
    };

    fetchData();
 }, [id]);

 if (!entry) return <div>Loading...</div>;

 return (
    <div>
      <h2>View Entry</h2>
      <p>Price: {entry.price}</p>
      <img src={entry.imageURL} alt="Uploaded" />
    </div>
 );
};

export default ViewEntry;
