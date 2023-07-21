import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase';
import Post from './Post';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log('logged out');
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (user.uid) {
      const fetchPosts = async () => {
        const postsCollection = collection(firestore, 'posts');
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
      <h1 className = "tw-text-white tw-text-2xl tw-font-bold tw-mb-4">My Posts</h1>
      <div className="tw-flex">
        <Link to="/forum" className="tw-text-white hover:tw-text-gray-300 tw-mr-4">
          Main
        </Link>
        <Link to="/home" className="tw-text-white hover:tw-text-gray-300 tw-mr-4">
          Home
        </Link>
        <div
          className="login tw-text-white tw-cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
      {posts.length === 0 ? (
      <p>You have not posted anything yet. Make a post now!</p>
    ) : (
      posts.map((post) => <Post key={post.id} post={post} />)
    )}
    </div>
  );
}

export default MyPosts;
