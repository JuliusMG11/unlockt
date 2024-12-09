import { IonContent, IonPage, IonLoading } from '@ionic/react';
import PostBox from '../../components/Moleculas/m-post-box/m-post-box';
import TitleHeader from '../../components/Moleculas/m-title-header/m-title-header';
import './posts-page.css';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, orderBy, onSnapshot } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

import { auth, firestore } from '../../firebase'; 

import { Link } from 'react-router-dom';

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const db = firestore;
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in.");
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const postsCollectionRef = collection(userDocRef, 'posts');
    const postsQuery = query(postsCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const userPosts: any[] = [];
      snapshot.forEach((doc) => {
        userPosts.push({ id: doc.id, ...doc.data() });
      });
      setPosts(userPosts);
      setLoading(false);
    });

    // Cleanup funkcia
    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <TitleHeader title='Your posts' />
        <div className='posts-page-container container'>
          {posts.length === 0 ? (
            <IonLoading 
              isOpen={loading}
              duration={3000} 
              spinner="circles"
            ></IonLoading>
          ) : (
            posts.map((post, index) => (
              <PostBox key={post.id} {...post} />
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PostsPage;