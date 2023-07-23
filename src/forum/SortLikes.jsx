import React, { useState, useEffect, useRef } from 'react';
import Post from '../forum/Post';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import '../css/Forum.css';

function SortLikes() {
  const [posts, setPosts] = useState([]);


  const dummy = useRef();

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

  function handleScrollTop() {
    console.log("scroll");
    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }
  return (
    <main>
      <TopNav />
      <div className='container-row centerAlign'>
        <SideNav className='tw-flex-auto'/>
        <div className='tw-text-white tw-flex-grow tw-mx-4 tw-flex tw-flex-col tw-h-full tw-overflow-y-auto'>
          <div ref={dummy}></div>
          <div className="titleBar tw-flex tw-sticky tw-top-0 tw-mb-4 tw-p-2">
              <h1 className="tw-text-white tw-text-2xl tw-font-bold">Forum</h1>
              <button onClick={handleScrollTop} className="tw-absolute tw-mt-2 tw-right-0 tw-text-white">Back to Top</button>
          </div>
        <div className="tw-flex tw-divide-4">
        <Link to="/forum" className="tw-text-white hover:tw-text-gray-300 tw-mr-4">
          Main
        </Link>
      </div>
      
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
    </div>
    </main>
  );
}

export default SortLikes;