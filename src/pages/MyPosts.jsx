import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore } from 'firebase/firestore';
import Post from './Post';
import { auth } from '../firebase';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    if (user) {
      setUid(user.uid);
      const fetchPosts = async () => {
        const db = getFirestore();
        const postsCollection = collection(db, 'posts');
        const userPostsQuery = query(postsCollection, where('userId', '==', user.uid));

        const unsubscribe = onSnapshot(userPostsQuery, (snapshot) => {
          const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPosts(postsData);
        });

        return unsubscribe;
      };

      fetchPosts();
    }
  }, [user]);

  return (
    <div>
      <h1>My Posts</h1>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default MyPosts;
