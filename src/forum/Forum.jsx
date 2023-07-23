import React, { useState, useEffect, useRef } from 'react';
import Post from './Post';
import { collection, onSnapshot, addDoc, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import '../css/Forum.css';

function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [searchTagContent, setSearchTagContent] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const dummy = useRef();


  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(firestore, 'posts');
    
      const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
        const postsData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          // Sort posts by creating timestamp in descending order, newer posts should appear on top
          .sort((a, b) => b.createdAt - a.createdAt); 
        if (!isSearching) {
          setPosts(postsData);
        } else {
          setFilteredPosts(postsData);
        }

      });
    
      return unsubscribe;
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (newPostTitle && newPostContent) {
      const postsCollection = collection(firestore, 'posts');
  
      await addDoc(postsCollection, {
        title: newPostTitle,
        content: newPostContent,
        comments: [],
        likedBy: [],
        likes: 0,
        username: user.displayName,
        userId: user.uid,
        createdAt: new Date(), // to sort the posts with creation time
        tag: [],
      });
  
      setNewPostTitle('');
      setNewPostContent('');
    }
  };

  const handleSearchTag = async () => {
    if (searchTagContent) {
      const postsCollection = collection(firestore, 'posts');
      const searchQuery = query(postsCollection, where('tag', 'array-contains-any', [{ content: searchTagContent.toLowerCase() }]));
  
      const unsubscribe = onSnapshot(searchQuery, (snapshot) => {
        const searchResults = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFilteredPosts(searchResults);
      });
  
      return unsubscribe;
    }
  };
  
  

  const handleClearSearch = async () => {
    setIsSearching(false);
    setSearchTagContent('');
  };
  
  function handleScrollTop() {
    console.log("scroll");
    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }
  //forum only handles creating posts, plus all the functions that we need to navigate to other pages

  return (
    <main>
      <TopNav />
      <div className='container-row centerAlign'>
        <SideNav />
        <div className='tw-text-white tw-flex-grow tw-mx-4 tw-flex tw-flex-col tw-h-full tw-overflow-y-auto'>
          <div ref={dummy}></div>
          <div className="titleBar tw-flex tw-sticky tw-top-0 tw-mb-4 tw-p-2">
              <h1 className="tw-text-white tw-text-2xl tw-font-bold">Forum</h1>
              <button onClick={handleScrollTop} className="tw-absolute tw-mt-2 tw-right-0 tw-text-white">Back to Top</button>
          </div>

          
          <div className="tw-flex tw-divide-4">
            <Link to="/my-posts" className="tw-text-white hover:tw-text-gray-300 tw-mr-4">
              My Posts
            </Link>
            <Link to="/sort-likes" className="tw-text-white hover:tw-text-gray-300 tw-mr-4">
              Sort by Likes
            </Link>
            <Link to="/home" className="tw-text-white hover:tw-text-gray-300 tw-mr-4">
              Home
            </Link>

            <div>
            <input
              type="text"
              className="tw-text-black"
              value={searchTagContent}
              onChange={(e) =>
                setSearchTagContent(e.target.value)}
            />
            <button
              className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-4 tw-mt-2 tw-text-white"
              onClick={() => {handleSearchTag();
                setIsSearching(true);
              }}
            >
              Search
            </button>
            <button
              className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-4 tw-mt-2 tw-text-white"
              onClick={() => {handleClearSearch();
              }}
            >
              Clear
            </button>
          </div>

          </div>
          <form onSubmit={handleCreatePost} className="tw-mb-4">
          <input
              type="text"
              className="tw-text-black tw-bg-white tw-rounded tw-p-2 tw-w-full tw-mb-2"
              placeholder="Post Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <textarea
              className="tw-text-black tw-bg-white tw-rounded tw-p-2 tw-w-full"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <button
              className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-w-full tw-p-4 tw-mt-2 tw-text-white"
              type="submit"
            >
              Create Post
            </button>
          </form>
          {!isSearching ? (
            posts.map((post) => (
              <Post key={post.id} post={post} />
            ))
          ) : (
            filteredPosts.map((post) => (
              <Post key={post.id} post={post} />
            ))
          )}
        </div>

      </div>
    </main>
  );
}

export default Forum;