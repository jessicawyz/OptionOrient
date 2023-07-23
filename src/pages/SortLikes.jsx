import React, { useState, useEffect } from 'react';
import Post from '../forum/Post';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function SortLikes() {
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
    const fetchPosts = async () => {
      const postsCollection = collection(firestore, 'posts');
    
      const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
        const postsData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          // Sort posts by number of likes
          .sort((a, b) => b.likes - a.likes); 
        setPosts(postsData);
      });
    
      return unsubscribe;
    };

    fetchPosts();
  }, []);

  return (
    <div className="tw-text-white">
      <h1 className="tw-text-white tw-text-2xl tw-font-bold tw-mb-4">Forum</h1>
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
      
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default SortLikes;