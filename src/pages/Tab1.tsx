import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase'; 
import { Filesystem, Directory } from '@capacitor/filesystem';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";
// import { Instagram } from '@mcprol/capacitor-instagram-plugin';
import { v4 as uuidv4 } from 'uuid';
import './Tab1.css';

const Tab1: React.FC = () => {

  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [link, setLink] = useState('');
  const [blurImage, setBlurImage] = useState('');

  const [nextStep, setNextStep] = useState(false);


  const handleFileChange = async (e: any) => {
    if (e.target.files[0]) {
       const file = e.target.files[0];
       setImage(file);
       setImageURL(URL.createObjectURL(file));
   
       // Create a new FileReader instance
       const reader = new FileReader();
       reader.onload = (event) => {
         // Check if the file was successfully read
         if (event.target && typeof event.target.result === 'string') {
          console.log('IN FUNCTIOn')
           // Pass the data URL to applyBlurEffect
           applyBlurEffect(event.target.result);
         }
       };
       // Read the file as a data URL
       reader.readAsDataURL(file);

        // const fileName = `instagram-story-${Date.now()}.jpg`;
        // const savedFile = await Filesystem.writeFile({
        //   path: fileName,
        //   data: file,
        //   directory: Directory.Documents,
        // });
        // Now you can use savedFile.uri to share the image
        // shareToInstagramStory(savedFile.uri);
    }
   };
   


   const applyBlurEffect = (imageDataUrl: string) => {
    const img = new Image();
    img.onload = () => {
       const canvas = document.createElement('canvas');
       const ctx = canvas.getContext('2d');
       if (ctx) {
         canvas.width = img.width;
         canvas.height = img.height;
         ctx.filter = 'blur(10px)';
         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
         const blurredImageDataUrl = canvas.toDataURL();
         setBlurImage(blurredImageDataUrl); // Store the blurred image data URL
       }
    };
    img.src = imageDataUrl; // Load the original image from the data URL
   };


 const handleSubmit = async (e) => {
  e.preventDefault();
   setNextStep(true)

  console.log(blurImage)
  // Upload image to Firebase Storage
  let uploadedImageURL = '';
  let blurImageURL = ''
  if (image) {
    // const storageRef = ref(storage, `images/${image.name}`);
    // const snapshot = await uploadBytes(storageRef, image);
    // uploadedImageURL = await getDownloadURL(storageRef);

    // const blurStorageRef = ref(storage, `images/${blurImage.name}`);
    // const blurSnapshot = await uploadBytes(storageRef, blurImage);
    // blurImageURL = await getDownloadURL(blurStorageRef);
    setImageURL(imageURL);
  }

  // Save account number, price, and image URL to Firestore
  const user = auth.currentUser;
  if (user) {
    const testObject = {
      price,
      user,
      imageURL,
      link,
      blurImage
    }

    console.log(testObject)

    // const userRef = doc(firestore, 'users', user.uid);
    // await setDoc(userRef, {
    //     price: price,
    //     imageURL: uploadedImageURL,
    //     createdAt: Date.now(),
    //     link: link
    // });
  }
};


const clickBtn = () => {
  shareToInstagramStory()
}


const shareToInstagramStory = async () => {
  const fileName = `instagram-story-${Date.now()}.jpg`;
  const imageData = image
  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: imageData, // Make sure this contains your image data
    directory: Directory.Documents,
 });

 // Convert the saved file into a File object
 const fileToShare = new File([savedFile], fileName, { type: 'image/jpeg' });
  // if (navigator.share) {
    
      await navigator.share({
        files: [fileToShare],
        title: 'Check out this image!',
        text: 'This image is shared from my web app.',
      });
      console.log('Image shared successfully.');
    // } catch (error) {
    //   console.error('Error sharing image:', error);
    // }
  
 
 
//  const instagramUrl = `instagram://story-camera?image=${encodeURIComponent(savedFile.uri)}`;
//  window.location.href = instagramUrl;
  // alert('Please open Instagram and select the image from your gallery.');

// const shareImage = async () => {
//   if (navigator.share) {
//     try {
//       await navigator.share({
//         files: [image],
//         title: 'Check out this image!',
//         text: 'This image is shared from my web app.',
//       });
//       console.log('Image shared successfully.');
//     } catch (error) {
//       console.error('Error sharing image:', error);
//     }
//   } else {
//     console.log('Web Share API not supported.');
//   }
};

// const shareOnInstagram = () => {
  
//   const instagramStoryLink = `instagram://story-camera?image=${encodeURIComponent(imageURL)}`;

//   window.location.href = instagramStoryLink;
// }


useEffect(() => {

 const uniqueId = uuidv4();
 setLink(`${window.location.origin}/view/${uniqueId}`);
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
         <input type="file" onChange={handleFileChange} />
         {imageURL && <img src={imageURL} alt="Uploaded" />}
         <button type="submit">
           Generate link
         </button>

         <h2>{ link }</h2>
       </form>
     </div>
      ) : ( 
        <div className="">
          STEP 2
         <div className="showImage-step2">
         {imageURL && <img src={blurImage} alt="Uploaded" />}
         </div>
          {<button onClick={clickBtn}>SHAREC IMAGE ON</button>}
        </div>
          )
      }
    </div>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
