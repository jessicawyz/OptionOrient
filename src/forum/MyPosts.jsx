import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase';
import Post from './Post';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import '../css/Forum.css';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const { user, logout } = UserAuth();
  
  const dummy = useRef();


  useEffect(() => {
    // Check if the user is logged in before proceeding
    if (user && user.uid) {
      const fetchPosts = async () => {
        const postsCollection = collection(firestore, 'posts');
        const userPostsQuery = query(postsCollection, where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(userPostsQuery, (snapshot) => {
          const posts = snapshot.docs.map((doc) => doc.data());
          setPosts(posts);
        });
  
        return () => {
          unsubscribe();
        };
      };
  
      fetchPosts();
    }
  }, [user]);
  

  function handleScrollTop() {
    console.log("scroll");
    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return (
    <main>
      <TopNav />
      <div className='container-row tw-flex'>
        <SideNav />
        <div className='tw-text-white tw-flex-grow tw-mx-4 tw-flex tw-flex-col tw-h-full tw-overflow-y-auto'>
          <div ref={dummy}></div>
          <div className="titleBar tw-flex tw-sticky tw-top-0 tw-mb-4 tw-p-2">
              <h1 data-testid="forum-title"  className="tw-text-white tw-text-2xl tw-font-bold">Forum</h1>
              <button onClick={handleScrollTop} className="tw-absolute tw-mt-2 tw-right-0 tw-text-white">Back to Top</button>
          </div>
          
          <div className="tw-flex tw-divide-4">
        <Link to="/forum" className="tw-text-white hover:tw-text-gray-300 tw-mr-4">
          Main
        </Link>
      </div>
      {posts.length === 0 ? (
      <p data-testid="no-posts-message">You have not posted anything yet. Make a post now!</p>
    ) : (
      posts.map((post) => <Post key={post.id} post={post} />)
    )}
    </div>
    </div>
    </main>
  );
}

export default MyPosts;
