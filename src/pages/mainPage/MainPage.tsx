import React, { useState, useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';

import './MainPage.css';

// FIREBASE
import { auth, firestore, storage, onAuthState } from '../../firebase'; 
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { IonContent, IonPage, IonButton, IonLoading  } from '@ionic/react';

// CAPACITOR
import { Filesystem, Directory } from '@capacitor/filesystem';

// CANVAS
import * as StackBlur from 'stackblur-canvas';

// SOCIAL MEDIA SHATE
// import { Share } from '@capacitor/share';
import { Sharing } from '@rediska1114/capacitor-sharing';

// COMPRESION
import imageCompression from 'browser-image-compression';


import { v4 as uuidv4 } from 'uuid';

// ICONS
import playIcon from '../../assets/icons/play.svg';
import pauseIcon from '../../assets/icons/pause.svg';
import inputIcon from '../../assets/icons/inputIcon.svg';
import closeIcon from '../../assets/icons/close.svg';
import instagramIcon from '../../assets/icons/share-insta-icon.svg';
import twitterIcon from '../../assets/icons/twitter-icon.svg';
import telegramIcon from '../../assets/icons/telegram-icon.svg';
import whatsappIcon from '../../assets/icons/whatsapp-icon.svg';
import backIcon from '../../assets/icons/back-icon.svg';
import audioIcon from '../../assets/icons/music-icon.svg';
import documentIcon from '../../assets/icons/document-icon.svg';


// COMPONENTS 
import CopyLink from '../../components/Moleculas/m-copy-link/m-copy-link';
import GlobalLogo from '../../components/Atoms/a-globa-logo/a-global-logo';

// UTILS
import { shortenUrl } from '../../utyls/shortenUrl';


// TO DO



const MainPage: React.FC = () => {

  // SET PRICE FOR IMAGE
  const [price, setPrice] = useState('');
  // CALCULATE PRICE FOR IMAGE AFTER - 15%
  const [ calculatePrice, setCalculatePrice] = useState('0');
  
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [blurImage, setBlurImage] = useState('');
  const [screenImage, setScreenImage] = useState('');


  const [imageTarget, setImageTarget] = useState('')

  const [link, setLink] = useState('');
  
  const [nextStep, setNextStep] = useState(false);

  const [fetchImageUrl, setFetchImageUrl] = useState('');

  // VIDEO STATES
  const [showVideo, setShowVideo] = useState(false);
  const [video, setVideo] = useState('');
  const [hideInput, setHideInput] = useState(true);
  const [videoThumbnail, setVideoThumbnail] = useState('');

  // SOUND STATE
  const [soundLink, setSoundLink] = useState('');
  const [soundFile, setSoundFile] = useState<File | null>(null);


  // PDF STATE
  const [documentLink, setDocumentLink] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');

  // STATE FOR INPUT SENDING
  const [isFileSelected, setIsFileSelected] = useState(false); 

  const SUPPORTED_DOCUMENT_TYPES = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'text/plain': 'TXT'
  };

  // PROGRESS BAR STATE
  const [submitProgress, setSubmitProgress] = useState(0);



  // SET PRICE AND CALCULATE - 15% from original price
  const calculatePriceFunction = (originalPrice: string) => {
    const discount = 0.15;
    const finalPriceValue = parseFloat(originalPrice) * (1 - discount);
    setCalculatePrice(Math.round(finalPriceValue).toString());
    setPrice(originalPrice); // Uloženie ceny
  };

  useEffect(() => {
    if (imageTarget) {
      applyBlurEffect(imageTarget, true);
    } else if(videoThumbnail) {
      applyBlurEffect(videoThumbnail, true);
    } else if (soundLink) {
      applyBlurEffect(audioIcon, false);
    } else if(documentLink) {
      applyBlurEffect(documentIcon, false);
    }
  }, [price]);

  // CREATE SHARE IMAGE CANVAS
   const applyBlurEffect = (imageDataUrl: string, isBlur: boolean) => {
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
          if(isBlur) {
            StackBlur.imageDataRGBA(imageData, 50, 80 ,200, 200, 6);
          }

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

   const applyScreenImage = (image: string, isBlur: boolean) => {
     const img = new Image();
     img.onload = () => {
      const canvas = document.createElement('canvas');
       const ctx = canvas.getContext('2d');
       if (ctx) {
       
        canvas.width = img.width;
        canvas.height = img.height;
        if(isBlur) {
          ctx.filter = 'blur(14px)';
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const showBlurredImage = canvas.toDataURL();
        setScreenImage(showBlurredImage);
      }
    }

    img.src = image;
   }


   let blurImageURL = '';
   let uploadedImageURL = '';
   let instaImageURL = '';

   const handleFileChange = async (e: any) => {
    e.preventDefault();
  
    setIsFileSelected(e.target.files.length > 0);

    if (e.target.files[0]) {
       const file = e.target.files[0];
       const reader = new FileReader();
       setHideInput(false);
       
       if (file.type.startsWith('image/')) {
        console.log('TOTO JE IMAGE');
  
        // Kompresia obrázka
        const options = {
          maxSizeMB: 1, // MAX SIZE MB
          maxWidthOrHeight: 1920, // MAX WIDTH OR HEIGHT
          useWebWorker: true, // USE WEB WORKER
        };
  
        try {
          const compressedFile = await imageCompression(file, options);
          setImage(compressedFile);
          setImageURL(URL.createObjectURL(compressedFile));
  
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
              setImageTarget(event.target.result);
              applyScreenImage(event.target.result, true);
            }
          };
  
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          console.error('Error during image compression:', error);
        }
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
      
              setImageURL(thumbnailURL);
              setVideoThumbnail(thumbnailURL);
              applyScreenImage(thumbnailURL, true);
            }
          });

       }  else if (file.type.startsWith('audio/')) {

        const audio = document.createElement('audio');
        audio.src = URL.createObjectURL(file);

        setSoundFile(file);
        setSoundLink(audio.src);
        setImageURL("");
        console.log('TOTO je vo vnutri', file.name)


      } else if (Object.keys(SUPPORTED_DOCUMENT_TYPES).includes(file.type)) {
        console.log(file);

        const document = URL.createObjectURL(file);
        setDocumentFile(file);
        setDocumentLink(document);
        setDocumentType(file.type);
      }
       
        // Read the file as a data URL
        reader.readAsDataURL(file);
    }
   };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitProgress(0);
  
    const submitButton = document.querySelector('.custom-submit-btn') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
    }
  
    const interval = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 1;
      });
    }, 50);
  
    try {
      let uploadedImageURL = '';
      let uploadedScreenImageURL = '';
      let instaImageURL = '';

      let uploadedVideoURL = '';

      let uploadedSoundURL = '';

      let uploadedDocumentURL = '';
  
      // Handle video upload if video exists
      if (video) {
        const videoBlob = await fetch(video).then(r => r.blob());
        const videoRef = ref(storage, `videos/${uuidv4()}.mp4`);
        await uploadBytes(videoRef, videoBlob);
        uploadedVideoURL = await getDownloadURL(videoRef);
        
        // Use the video thumbnail as the image
        if (imageURL) {
          const response = await fetch(imageURL);
          const imageBlob = await response.blob();
          const imageRef = ref(storage, `image/${uuidv4()}.png`);
          await uploadBytes(imageRef, imageBlob);
          uploadedImageURL = await getDownloadURL(imageRef);
        }
      } 
      
      if (image) {
        // Handle image upload if it's an image file
        const storageRef = ref(storage, `image/${uuidv4()}`);
        await uploadBytes(storageRef, image);
        uploadedImageURL = await getDownloadURL(storageRef);

      }

      if (soundLink) {
        // SOUND LINK
        const soundBlob = await fetch(soundLink).then(r => r.blob());
        const soundRef = ref(storage, `sounds/${soundFile?.name}`);
        await uploadBytes(soundRef, soundBlob);
        uploadedSoundURL = await getDownloadURL(soundRef);
      }
  

      // Handle blur image upload
      if (blurImage) {
        const blurBlob = await fetch(blurImage).then(r => r.blob());
        const instaStorageRef = ref(storage, `instaImages/${uuidv4()}.png`);
        await uploadBytes(instaStorageRef, blurBlob);
        instaImageURL = await getDownloadURL(instaStorageRef);
      }
  
      // Handle screen image upload
      if (screenImage) {
        const screenBlob = await fetch(screenImage).then(r => r.blob());
        const screenImageRef = ref(storage, `screenImages/${uuidv4()}.png`);
        await uploadBytes(screenImageRef, screenBlob);
        uploadedScreenImageURL = await getDownloadURL(screenImageRef);
      }

      if (documentLink) {
        const documentBlob = await fetch(documentLink).then(r => r.blob());
        const fileExtension = SUPPORTED_DOCUMENT_TYPES[documentType].toLowerCase();
        const documentRef = ref(storage, `documents/${uuidv4()}.${fileExtension}`);
        await uploadBytes(documentRef, documentBlob);
        uploadedDocumentURL = await getDownloadURL(documentRef);
      }
  
      const user = auth.currentUser;
      if (user) {
        const postId = uuidv4();
        const userRef = doc(firestore, 'users', user.uid, 'posts', postId);
        const generatedLink = `${window.location.origin}/view/${user.uid}/${postId}`;
        const shortLink = await shortenUrl(generatedLink);
        setLink(shortLink);

        const docData: any = {
          createdAt: Date.now(),
          price: price,
          fee_price: calculatePrice,
          link: generatedLink,
          counter_show_image: 0,
          insta_image_url: instaImageURL,
        };

        if (image) {
          docData.image_url = uploadedImageURL;
          docData.blur_image_url = uploadedScreenImageURL;
          docData.is_image = true;
        }

        if (video) {
          docData.image_url = uploadedImageURL;
          docData.blur_image_url = uploadedScreenImageURL;
          docData.video_url = uploadedVideoURL;
          docData.is_video = true;
        }

        if (soundLink) {
          docData.is_sound = true;
          docData.sound_url = uploadedSoundURL;
          docData.sound_name = soundFile?.name ? soundFile.name : '';
        }

        if (documentLink) {
          docData.is_document = true;
          docData.document_name = documentFile?.name ? documentFile.name : '';
          docData.document_url = uploadedDocumentURL;
          docData.document_type = documentType ? SUPPORTED_DOCUMENT_TYPES[documentType] : null;
        }
  
        await setDoc(userRef, docData);

        setSubmitProgress(100);
      }
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setNextStep(true);
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  };



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
        // console.log("User data:", userDocSnap.data());

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
    setShowVideo(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setStatePlay(true);
      }
    }, 0);
  }
}


const removeFile = () => {
  setImage(null);
  setImageURL('');
  setHideInput(true)
  setVideo('');
  setShowVideo(false);
  setSoundLink('');
  setDocumentLink('');
  setDocumentFile(null);
  setDocumentType('');
  setImageTarget('');
}


// STEP TWO BACK ARROW AND RESET ALL THINGS
const cancelStep = () => {
  setNextStep(false);
  removeFile();
  setSubmitProgress(0);
  setPrice('0');
  setCalculatePrice('0');
}

useEffect(() => {
 loadDataFromFirebase();

}, [])

  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding'>

        <div className="main-page">
        <div className="intro-logo">
               <GlobalLogo iconColor="#6A2EFD" textColor="#121212" />
            </div>
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
                      <button className='input-btn'>ADD FILE</button>
                    </div>
                    : 
                    <div className="load-content-section">
                      {imageURL && !video && !soundLink && !documentLink ? (
                        <div className="image">
                          <img src={imageURL} alt="Uploaded" />
                          <button className='remove-btn' onClick={removeFile}>
                            <img src={closeIcon} alt="" />
                          </button>
                        </div> 
                      ) : null}
                              
                      <div className="video-section">
                        {video ? (
                          <div className="video">
                            <button className='remove-btn' onClick={removeFile}>
                              <img src={closeIcon} alt="" />
                            </button>
                              {!showVideo ? (
                              <div className="thumbnail">
                                <img src={imageURL} alt="Video thumbnail" />
                              </div>
                            ) : (
                              <video ref={videoRef} width="320" height="240">
                                <source src={video} type="video/mp4" />
                              </video>
                            )}
                            {!statePlay && (
                              <div className="btn" onClick={playVideo}>
                                <img src={playIcon} alt="" />
                              </div>
                            )}
                          </div>
                        ) : null} 
                      </div>
                        
                      {soundLink && (
                        <div className="sound-section">
                          <div className="sound">
                            <button className='remove-btn' onClick={removeFile}>
                              <img src={closeIcon} alt="" />
                            </button>
                            
                            <div className="thumbnail">
                                <img src={audioIcon} alt="Sound thumbnail" />
                              </div>
                          </div>
                         <div className="sound-controls">
                          <p>{soundFile?.name}</p>
                            <audio controls>
                                <source src={soundLink} type="audio/mpeg" />
                            </audio>
                          </div>
                        </div>
                      )}

                      { documentLink && (
                        <div className="document-section">
                          <div className="document">
                            <button className='remove-btn' onClick={removeFile}>
                              <img src={closeIcon} alt="" />
                            </button>
                            <div className="thumbnail">
                                <img src={documentIcon} alt="" />
                                <p>{documentFile?.name}</p>
                              </div>
                          </div>

                        </div>
                      )}


                    </div>
                  }
                

                </div>
              </div>
                <div className="min-price-message">
                  <p>Minimalna cena postu je 20$</p>
                </div>
              <div className="price-input">
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => calculatePriceFunction(e.target.value)} 
                  placeholder="0"
                />
              </div>
              <div className="min-price">
                <h2>Dostanes: { isNaN(Number(calculatePrice)) ? '0' : calculatePrice }$</h2>
              </div>
              <button 
                  type="submit" 
                  className="custom-submit-btn" 
                  style={{ 
                      background: isFileSelected && Number(price) >= 20 ? `linear-gradient(to right,  #4920B0 ${submitProgress}%, #682DFC ${submitProgress}%)` : '#d3d3d3' // Zmena farby pozadia
                  }} 
                  disabled={!isFileSelected || Number(price) < 20} // Deaktivácia tlačidla
              >
                  {submitProgress === 0 ? `Generating link` : `${submitProgress}%`}
              </button>

            </form>
          </div>
            ) : ( 
              <div className="">
                <div className="showImage-step2">
                    <div className="show-generate-image">
                      <button className="show-generate-image-back-btn" onClick={() => cancelStep()}>
                        <img src={backIcon} alt="" />
                      </button>
                      <div className="price-label">
                        <p>{price ? <span>{price}</span> : null}$</p>
                      </div>
                      {soundLink ? (
                        <div className="name-section">
                            <img className='icon' src={audioIcon} alt="Audio Icon" />
                            <p>{soundFile?.name}</p>
                        </div>
                      ) : documentLink ? (
                       <div className="name-section">
                         <img className='icon' src={documentIcon} alt="Document Icon" />
                          <p>{documentFile?.name}</p>
                       </div>
                      ) : (
                        <img className='image' src={screenImage} alt="" />
                      )}
                    </div>
                    <h2>Copy or share the link</h2>
                    <CopyLink link={link} />
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
                <div className="step-2-actions">
                  <button 
                    onClick={ shareToInstagram } 
                    className="btn-share-to-insta"
                  >
                    <div className="icon">
                      <img src={instagramIcon} alt="" />
                    </div>
                    Add to story
                  </button>
                  <button className='share-social-btn'>
                    <img src={whatsappIcon} alt="" />
                  </button>
                  <button className='share-social-btn'>
                    <img src={telegramIcon} alt="" />
                  </button>
                  <button className='share-social-btn'>
                    <img src={twitterIcon} alt="" />
                  </button>
                </div>
              </div>
                )
            }
          </div>

      </IonContent>
    </IonPage>
  );
};

export default MainPage;
