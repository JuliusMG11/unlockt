import { IonContent, IonInput, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonLoading  } from '@ionic/react';
import { Route } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { auth, firestore, storage, onAuthState } from '../../firebase'; 
import { Filesystem, Directory } from '@capacitor/filesystem';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import * as StackBlur from 'stackblur-canvas';

// import { Share } from '@capacitor/share';
import { Sharing } from '@rediska1114/capacitor-sharing';


import { v4 as uuidv4 } from 'uuid';
import playIcon from '../../assets/icons/play.svg';
import pauseIcon from '../../assets/icons/pause.svg';
import inputIcon from '../../assets/icons/inputIcon.svg';
import closeIcon from '../../assets/icons/close.svg';
import './MainPage.css';



const MainPage: React.FC = () => {

  // SET PRICE FOR IMAGE
  const [price, setPrice] = useState('');
  // CALCULATE PRICE FOR IMAGE AFTER - 15%
  const [ calculatePrice, setCalculatePrice] = useState('');
  
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [imageTarget, setImageTarget] = useState('')

  const [link, setLink] = useState('');
  const [blurImage, setBlurImage] = useState('');

  const [screenImage, setScreenImage] = useState('');

  const [nextStep, setNextStep] = useState(false);

  const [fetchImageUrl, setFetchImageUrl] = useState('');

  const [video, setVideo] = useState('');
  const [hideInput, setHideInput] = useState(true)



  // CREATE SHARE IMAGE CANVAS
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
         

       
          ctx.drawImage(img, 50, 80 ,200, 200);
          // Získanie obrazových dát z canvas
          const imageData = ctx.getImageData(50, 80, 200, 200);

          // Použitie stackblur na rozmazanie obrazových dát
          StackBlur.imageDataRGBA(imageData, 50, 80 ,200, 200, 6);

          // Vloženie rozmazaných obrazových dát späť na canvas
          ctx.putImageData(imageData, 50, 80);
        


          // LOGO TEXT
          ctx.filter = 'none';
          ctx.font = "28px Arial bold";
          ctx.fillStyle = '#121212';
          ctx.fillText("UnBlurMe", 95, 60);

          // PRICE TEXT
          ctx.font = "22px Arial";
          ctx.fillStyle = '#121212';
          ctx.fillText(`${price}€`, 44, 326);

          console.log(price.length)

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
       const reader = new FileReader();
       setHideInput(false)
       if (file.type.startsWith('image/')) {
        console.log('TOTO JE IMAGE');

        setImage(file);
        setImageURL(URL.createObjectURL(file));
     

        reader.onload = (event) => {
          // Check if the file was successfully read
          if (event.target && typeof event.target.result === 'string') {
            // Pass the data URL to applyBlurEffect
            setImageTarget(event.target.result)
            applyScreenImage(event.target.result);
          }
        };

       } else if (file.type.startsWith('video/')) {
          console.log('TOTO JE VIDEO');


          const video = document.createElement('video');
          video.src = URL.createObjectURL(file);

          setVideo(video.src)
    
          video.addEventListener('loadeddata', () => {
            // Set current time to 0 to trigger seeked event
            video.currentTime = 0;
          });
    
          video.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnailURL = canvas.toDataURL('image/png');
              console.log(thumbnailURL); // Log the thumbnail URL
              setImageURL(thumbnailURL);
              applyBlurEffect(thumbnailURL);
              applyScreenImage(thumbnailURL);
            }
            // video.src = ''; // Clean up video src
          });

       }
      
   
       // Create a new FileReader instance
       
       
       // Read the file as a data URL
       reader.readAsDataURL(file);
    }
   };


 const handleSubmit = async (e) => {
  e.preventDefault();
  if(imageTarget) {
    applyBlurEffect(imageTarget);
    console.log(imageTarget)
  }

      // Create a new FileReader instance
    const reader = new FileReader();
    reader.onload = (event) => {
      // Check if the file was successfully read
      if (event.target && typeof event.target.result === 'string') {
        // Pass the data URL to applyBlurEffect
        applyBlurEffect(event.target.result);
      }
    };
    const storageRef = ref(storage, `image/${image.name}`);
    const snapshot = await uploadBytes(storageRef, image);
    uploadedImageURL = await getDownloadURL(storageRef);


      if (screenImage) {
       // Convert blurImage data URL to Blob for upload
        const response = await fetch(screenImage);
        const blob = await response.blob();
        const blurStorageRef = ref(storage, `blurredImages/${uuidv4()}.png`); // Use a unique name for the blurred image
        await uploadBytes(blurStorageRef, blob);
        blurImageURL = await getDownloadURL(blurStorageRef);
      }

      const user = auth.currentUser;
      if (user) {
        const testObject = {
          price,
          user,
          uploadedImageURL,
          link,
          blurImage
        }

        console.log(testObject)
    
        const postId = uuidv4();
        setLink(`${window.location.origin}/view/${user.uid}/${postId}`);
        const userRef = doc(firestore, 'users', user.uid, 'posts', postId );
        await setDoc(userRef, {
            price: price,
            imageURL: uploadedImageURL,
            blurImageUrl: blurImageURL,
            createdAt: Date.now(),
            link: link
        });
    };
    setNextStep(true)
}



const db = firestore;

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
//  console.log(uploadedImageURL)
// try {
//   await Share.share({
//     title: 'Check out ctx cool image!',
//     text: 'Here is the link to the image:',
//     url: 'www.google.com', // Assuming 'link' is the URL you want to share
//     dialogTitle: 'Share ctx link', // Android only, you can set the title of the share dialog
//   });
// } catch (error) {
//     console.error('Error sharing to WhatsApp:', error);
// }
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
 

// SHARE TO INSTAGRAM
const sharingInstance = new Sharing();
const options = {
  backgroundImage: blurImage, 
  facebookAppId: '1165244051309225',
  backgroundTopColor: '#ff0000',
  backgroundBottomColor: '#00ff00',
};

const shareToInstagram = () => {
  sharingInstance.canShareToInstagramStories(options).then(canShare => {
    if (canShare) {
      sharingInstance.shareToInstagramStories({
        facebookAppId: options.facebookAppId, // Use the same Facebook App ID as in your options
        backgroundImageBase64: options.backgroundImage, // Use the Base64 encoded image URL from your options
      }).then(() => {
        console.log('Successfully shared to Instagram Stories');
      }).catch(error => {
        console.error('Failed to share to Instagram Stories:', error);
      });
  }
  })
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


// VIDEO CONTROLS
const videoRef = useRef(null);
const [statePlay, setStatePlay] = useState(false);
const playVideo = () => {
 if(!statePlay) {
  videoRef.current.play();
  setStatePlay(true);
 }
}

const pauseVideo = () => {
  if(statePlay) {
    videoRef.current.pause();
    setStatePlay(false)
  }
}


const removeFile = () => {
  setImage(null);
  setImageURL('');
  setHideInput(true)
}

const calculatePriceFunction = (originalPrice: string) => {
  const discount = 0.15;
  const finalPrice = parseFloat(originalPrice) * (1 - discount);
  setCalculatePrice(Math.round(finalPrice).toString());
  setPrice(originalPrice)
}

/* COPY LINK */
const linkRef = useRef(null);
const copyToClipboard = () => {
  if (linkRef.current) {
    navigator.clipboard.writeText(linkRef.current.innerText).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
};

useEffect(() => {
 loadDataFromFirebase();

}, [])

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Load your image and set price</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen className='ion-padding'>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="">
          {!nextStep ? (
            <div className="first-step">
              <form className='form-generator' onSubmit={handleSubmit}>
                <div className="custom-file-input">
                  <div className="input-container"> 
                    { hideInput ? 
                    <div className="file-input">
                      <div className="input-icon">
                        <img src={inputIcon} alt="" />
                      </div>
                      <input id="inputFileTest" type="file" onChange={handleFileChange} />
                      <button className='input-btn'>Add file</button>
                    </div>
                    : 
                  
                    <div className="load-content-section">
                    {imageURL ? (
                      <div className="image">
                        <img src={imageURL} alt="Uploaded" />
                        <button className='remove-btn' onClick={removeFile}>
                          <img src={closeIcon} alt="" />
                        </button>
                      </div> 
                      )
                    : null}
          
                    {/* <div className="video-section">
                    {video ? (
                      <div className="video">
                          <video ref={videoRef} width="320" height="240">
                              <source src={video} type="video/mp4" />
                        </video>
                        {!statePlay ? 
                        <div className="btn" onClick={playVideo}>
                          <img src={playIcon} alt="" />
                        </div> : 
                        <div className="btn" onClick={pauseVideo}>
                            <img src={pauseIcon} alt="" />
                        </div>
                        } 
                      </div> )
                        : null} 
                    </div> */}
                  
                  </div>
                  }
                

                </div>
              </div>
            
              <div className="price-input">
                <input type="number" value={price} onChange={(e) => calculatePriceFunction(e.target.value)} placeholder="0.00$" />
              </div>
              <div className="min-price">
                <h2>Dostanes: { calculatePrice }</h2>
              </div>
              <IonButton type="submit">
                Generate link
              </IonButton>

            </form>
          </div>
            ) : ( 
              <div className="">
                Blured app step 2
              <div className="showImage-step2">
                  {/* <img src={blurImage} alt="Uploaded" /> */}
                  <div className="show-generate-image">
                    <div className="price-label">
                    {price ? <span>{price}</span> : null}
                    </div>
                        <img src={screenImage} alt="" />
                  </div>
                  <h2>Copy or share the link</h2>
                 <div className="link-section">
                   <span ref={linkRef}>{ link }</span>
                   <div className="copy-btn">
                      <button onClick={copyToClipboard}>copy link</button>
                   </div>
                 </div>
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
                <IonButton onClick={ shareToInstagram }>SHAREC IMAGE ON INSTAGRAM</IonButton>
                
              </div>
                )
            }
          </div>

      </IonContent>
    </IonPage>
  );
};

export default MainPage;
