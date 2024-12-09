import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { IonContent, IonPage, IonIcon, IonLoading, IonButton } from '@ionic/react';
import './post-page.css';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { firestore, auth } from '../../firebase'; 

import { arrowBack } from 'ionicons/icons';
import playIcon from '../../assets/icons/play.svg';

import CopyLink from '../../components/Moleculas/m-copy-link/m-copy-link';

// UTILS
import { shortenUrl } from '../../utyls/shortenUrl';


import audioIcon from '../../assets/icons/music-icon.svg';
import documentIcon from '../../assets/icons/document-icon.svg';


// TODO
// -- dorobit mazanie prispevku

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [link, setLink] = useState('');

  // TIMER STATE
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // VIDEO STATE
  const [showVideo, setShowVideo] = useState(false);

  // VIDEO CONTROLS
  const [statePlay, setStatePlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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


  const history = useHistory();
  const handleGoBack = () => {
    console.log('go back');
    history.goBack();
  };

  // COPY LINK
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
    const fetchPost = async () => {
      const user = auth.currentUser;

      
      if (user && id) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const postDocRef = doc(userDocRef, 'posts', id);
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setPost(postData);
          setCreatedAt(postData.createdAt);
  
          // SHORTEN URL
          const shortLink = await shortenUrl(postData.link);
          setLink(shortLink);
  
          // Nastav čas na 24 hodín
          const now = new Date();
          const expirationTime = new Date(postData.createdAt);
          expirationTime.setHours(expirationTime.getHours() + 24);
          setTimeLeft(Math.max(0, expirationTime.getTime() - now.getTime()));
        } else {
          console.log('No such document!');
        }
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000)); 
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const handleRefreshPost = async () => {
    if (post) {
      const now = new Date();
      setCreatedAt(now.getTime());
      
        console.log(id)
        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
        const postDocRef = doc(userDocRef, 'posts', id);
        await setDoc(postDocRef, { ...post, createdAt: now.getTime() }, { merge: true });
        setTimeLeft(24 * 60 * 60 * 1000); // reset na 24 hodín
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>

          {post ? (
            <div className='m-post-page container'>

              <div className='m-post-page__image-content'>
                {post.image_url && !post.is_video && !post.is_sound && !post.is_document ? (
                  <div className='m-post-page__image-content--image'>
                    <img src={post.image_url} alt="" />
                  </div>
                  ): null }
                  {post.is_video ? (
                  <div className='m-post-page__image-content--video'>
                
                      <div className="video">
                          {!showVideo ? (
                            <div className="thumbnail">
                              <img src={post.image_url} alt="Video thumbnail" />
                            </div>
                          ) : (
                            <video ref={videoRef} width="320" height="240" controls>
                              <source src={post.video_url} type="video/mp4" />
                            </video>
                          )}
                          {!statePlay && (
                              <div className="btn" onClick={playVideo}>
                                <img src={playIcon} alt="" />
                              </div>
                            )}
                      </div>
                 
                </div>
                 ) : null }

                {post.is_sound ? (
                    <div className='m-post-page__image-content--sound'>
                      <div className="m-post-page__image-content--sound__image">
                        <img className='icon' src={audioIcon} alt="" />
                      </div>
                      <audio src={post.sound_url} controls></audio>
                    </div>
                  ): null }

                  {post.is_document ? (
                    <div className='m-post-page__image-content--document'>
                      <div className="m-post-page__image-content--document__image">
                        <img src={documentIcon} alt="" />
                        <p>{post.document_name}</p>
                      </div>
                    </div>
                  ) : null}
              </div>

              <div className='m-post-page__content'>
               <div className='m-post-page__content--item timer'>
                  <p>Čas do vypršania:</p>
                  {timeLeft > 0 ? ( 
                    <div className="timer-content">
                      <h4>{Math.floor(timeLeft / (1000 * 60 * 60))} h</h4>
                      <h4>{Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))} m</h4>
                      <h4>{Math.floor((timeLeft % (1000 * 60)) / 1000)} s</h4>
                    </div>
                  ) : (
                    <h4>Čas vypršal</h4> 
                  )}
                </div>
                <div className='m-post-page__content--item'>
                  <p>Total price with fee:</p>
                  <h4>{post.price}$</h4>
                </div>
                <div className='m-post-page__content--item'>
                  <p>Your price:</p>
                  <h4>{post.fee_price}$</h4>
                </div>
                <div className='m-post-page__content--item'>
                  <p>Unblured post:</p>
                  <h4>{post.counter_show_image}</h4>
                </div>
              </div>
              <CopyLink link={link} />
              {timeLeft <= 0 && (
                <IonButton onClick={handleRefreshPost}>Obnoviť príspevok</IonButton>
              )}
            </div>
          ) : (
            <IonLoading 
              isOpen={loading}
              duration={3000} 
              spinner="circles"
            ></IonLoading>
          )}

      </IonContent>
    </IonPage>
  );
};

export default PostPage;