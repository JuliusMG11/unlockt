import { IonContent, IonInput, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth, firestore, storage, onAuthState } from '../firebase'; 
import { Filesystem, Directory } from '@capacitor/filesystem';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";


import { Instagram } from '@awesome-cordova-plugins/instagram';
import { Share } from '@capacitor/share';

import { Helmet } from 'react-helmet';


import { v4 as uuidv4 } from 'uuid';
import './Tab1.css';

const Tab1: React.FC = () => {

  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');

  const [link, setLink] = useState('');
  const [blurImage, setBlurImage] = useState('');

  const [screenImage, setScreenImage] = useState('');

  const [nextStep, setNextStep] = useState(false);

  const [fetchImageUrl, setFetchImageUrl] = useState('');



   const applyBlurEffect = (imageDataUrl: string) => {
    const img = new Image();
    img.onload = () => {
       const canvas = document.createElement('canvas');
       const ctx = canvas.getContext('2d');
       if (ctx) {
          canvas.width = 300;
          canvas.height = 500;

          // GRADIENT
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#12C2E9'); // Start color
          gradient.addColorStop(1, '#F64F59'); // En
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // WHITE BOXES
          const width = 240;
          const height = 340;
          const x = 30;
          const y = 30;
          const radius = 22;
          
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();
         

          // IMAGE
          ctx.filter = 'blur(6px)';
          ctx.drawImage(img, 50, 80 ,200, 200);


          // LOGO TEXT
          ctx.filter = 'none';
          ctx.font = "28px Arial bold";
          ctx.fillStyle = '#121212';
          ctx.fillText("UnBlurMe", 95, 60);

          // PRICE TEXT
          ctx.font = "22px Arial";
          ctx.fillStyle = '#121212';
          ctx.fillText(`€${price}`, 44, 326)
          console.log(price)

          // COPY LINK RECTANGLE
          ctx.translate(78, 400);
          ctx.fillStyle = "rgba(0, 0, 0, 0)";
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.lineJoin = "round";
          ctx.font = "14px Arial";
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.moveTo(16, 0);
          ctx.arc(140 - 16, 16, 16, 1.5 * Math.PI, 2 * Math.PI);
          ctx.moveTo(140, 16);
          ctx.arc(140 - 16, 52 - 16, 16, 0, 0.5 * Math.PI);
          ctx.moveTo(140 - 16, 52);
          ctx.arc(16, 52 - 16, 16, 0.5 * Math.PI, Math.PI);
          ctx.moveTo(0, 52 - 16);
          ctx.arc(16, 16, 16, Math.PI, 1.5 * Math.PI);
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#fff";
          ctx.fillText("Past link here", 70, 26);

          const blurredImageDataUrl = canvas.toDataURL();
          setBlurImage(blurredImageDataUrl); // Store the blurred image data URL

       }
    };
    img.src = imageDataUrl;
   };

   const applyScreenImage = (image: string) => {
     const img = new Image();
     img.onload = () => {
      const canvas = document.createElement('canvas');
       const ctx = canvas.getContext('2d');
       if (ctx) {
       
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = 'blur(40px)';
        ctx.shadowBlur = 16;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const showBlurredImage = canvas.toDataURL();
        setScreenImage(showBlurredImage);
      }
    }

    console.log(screenImage)
    img.src = image;
   }


   let blurImageURL = '';
   let uploadedImageURL = '';

   const handleFileChange = async (e: any) => {
    e.preventDefault();
    if (e.target.files[0]) {
       const file = e.target.files[0];
       setImage(file);
       setImageURL(URL.createObjectURL(file));
   
       // Create a new FileReader instance
       const reader = new FileReader();
       reader.onload = (event) => {
         // Check if the file was successfully read
         if (event.target && typeof event.target.result === 'string') {
           // Pass the data URL to applyBlurEffect
           applyBlurEffect(event.target.result);
           applyScreenImage(event.target.result);
         }
       };
       // Read the file as a data URL
       reader.readAsDataURL(file);
    }
   };


 const handleSubmit = async (e) => {
  e.preventDefault();


      // Create a new FileReader instance
    // const reader = new FileReader();
    // reader.onload = (event) => {
    //   // Check if the file was successfully read
    //   if (event.target && typeof event.target.result === 'string') {
    //     // Pass the data URL to applyBlurEffect
    //     applyBlurEffect(event.target.result);
    //   }
    // };
    // const storageRef = ref(storage, `image/${image.name}`);
    // const snapshot = await uploadBytes(storageRef, image);
    // uploadedImageURL = await getDownloadURL(storageRef);


      // if (blurImage) {
      //  // Convert blurImage data URL to Blob for upload
      //   const response = await fetch(blurImage);
      //   const blob = await response.blob();
      //   const blurStorageRef = ref(storage, `blurredImages/${uuidv4()}.png`); // Use a unique name for the blurred image
      //   await uploadBytes(blurStorageRef, blob);
      //   blurImageURL = await getDownloadURL(blurStorageRef);
      // }

    //   const user = auth.currentUser;
    //   if (user) {
    //     // const testObject = {
    //     //   price,
    //     //   user,
    //     //   uploadedImageURL,
    //     //   link,
    //     //   blurImage
    //     // }
    
    //     const postId = uuidv4();
    //     setLink(`${window.location.origin}/view/${user.uid}/${postId}`);
    //     const userRef = doc(firestore, 'users', user.uid, 'posts', postId );
    //     await setDoc(userRef, {
    //         price: price,
    //         imageURL: uploadedImageURL,
    //         blurImageUrl: blurImageURL,
    //         createdAt: Date.now(),
    //         link: link
    //     });
    // };
    setNextStep(true)
}





  // Save account number, price, and image URL to Firestore


const shareToInstagram = (image: string) => {
  Instagram.share(image, "caption").then(() => {
    console.log('Image shared successfully to Instagram');
  }, (error: any) => {
    console.error('Error sharing image to Instagram:', error);
  });
}

const db = firestore;


const shareInstagramBtn = async () => {
  console.log('MOREEEE *********' + blurImage)
  if (image) {
    shareToInstagram(blurImage);
  }        
};



const shareToWhatsApp = async() => {

  // onAuthStateChanged(auth, async (user) => {
  //   if (user) {
  //     const userDocRef = doc(db, "users", user.uid);
  //     const userDocSnap = await getDoc(userDocRef);
  //     if (userDocSnap.exists()) {
  //       console.log("User data:", userDocSnap.data().blurImageURL);
  //       setFetchImageUrl(userDocSnap.data().blurImageURL)

  //     } else {
  //       console.log("No such document!");
  //     }
  //   }
  // });
 console.log(uploadedImageURL)
try {
  await Share.share({
    title: 'Check out ctx cool image!',
    text: 'Here is the link to the image:',
    url: 'www.google.com', // Assuming 'link' is the URL you want to share
    dialogTitle: 'Share ctx link', // Android only, you can set the title of the share dialog
  });
} catch (error) {
    console.error('Error sharing to WhatsApp:', error);
}
  // if(fetchImageUrl) {
  //   try {
  //     await Share.share({
  //       title: 'Check out ctx cool image!',
  //       text: 'Here is the link to the image:',
  //       url: fetchImageUrl, // Assuming 'link' is the URL you want to share
  //       dialogTitle: 'Share ctx link', // Android only, you can set the title of the share dialog
  //     });
  //   } catch (error) {
  //       console.error('Error sharing to WhatsApp:', error);
  //   }
  // }
}
 


const loadDataFromFirebase = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        console.log("User data:", userDocSnap.data());

      } else {
        console.log("No such document!");
      }
    }
  });

} 


useEffect(() => {

 loadDataFromFirebase();

}, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Load your image and set price</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

<div className="">
    {!nextStep ? (
       <div className="first-step">
       <form onSubmit={handleSubmit}>
         <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
         <input id="inputFileTest" type="file" onChange={handleFileChange} />
         {imageURL && <img src={imageURL} alt="Uploaded" />}
         <IonButton type="submit">
           Generate link
         </IonButton>

       </form>
     </div>
      ) : ( 
        <div className="">
          STEP 2
         <div className="showImage-step2">
            <img src={blurImage} alt="Uploaded" />
            <img src={screenImage} alt="" />
            <h2>{ link }</h2>
         </div>
         <div>
          {/* <Helmet>
            <title>TEST TEST</title>
            <meta property="og:title" content="POST NAME" />
            <meta property="og:description" content="MOREOKEOKROEKRO" />
            <meta property="og:image" content={blurImage} />
            <meta property="og:url" content="www.google.com" />
          </Helmet> */}
          {/* Post content goes here */}
        </div>
          <IonButton onClick={shareInstagramBtn}>SHAREC IMAGE ON INSTAGRAM</IonButton>
        
        </div>
          )
      }
    </div>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
