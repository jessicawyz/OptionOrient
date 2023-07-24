import React, { useState, useEffect, useRef } from 'react';
import Post from './Post';
import { collection, onSnapshot, addDoc, query, where, doc, getDocs, updateDoc } from 'firebase/firestore';
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
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [searchResultError, setSearchResultError] = useState(false);
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const currUser = UserAuth();

  const dummy = useRef();

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(firestore, 'posts');
      const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        }).sort((a, b) => b.createdAt - a.createdAt);
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
    if (!newPostTitle.trim()) {
      setTitleError(true);
      return;
    }
    if (!newPostContent.trim()) {
      setBodyError(true);
      return;
    }
    if (newPostTitle && newPostContent) {
      const postsCollection = collection(firestore, 'posts');
      const newDocRef = await addDoc(postsCollection, {
        title: newPostTitle,
        content: newPostContent,
        comments: [],
        likedBy: [],
        likes: 0,
        username: user.displayName,
        userId: user.uid,
        createdAt: new Date(), // to sort the posts in creation time
        tag: [],
        postId: "",
      });
      const newId = newDocRef.id;
      console.log(newId);
      const newRef = doc(firestore, 'posts', `${newId}`);
      await updateDoc(newRef, {
        postId: `${newId}`
      });
      setNewPostTitle('');
      setNewPostContent('');
      setTitleError(false);
      setBodyError(false);
    }
  };

  const handleSearchTag = async () => {
    setSearchResultError('');
    setSearchError('');
    if (!searchTagContent.trim()) {
      setSearchError('Search cannot be empty');
      return;
    }
    if (searchTagContent) {
      const postsCollection = collection(firestore, 'posts');
      const searchQuery = query(postsCollection, where('tag', 'array-contains-any', [{ content: searchTagContent.toLowerCase() }]));
      const snapshot = await getDocs(searchQuery);
      const searchResults = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (searchResults.length === 0) {
        console.log('There are no posts with such a tag');
        setSearchResultError('no matching posts');
      } else {
        console.log('there is a search result');
      }
      setFilteredPosts(searchResults);
    } else {
      setFilteredPosts([]); 
    }
  };

  const handleClearSearch = async () => {
    setIsSearching(false);
    setSearchTagContent('');
  };

  function handleScrollTop() {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  //forum only handles creating posts, plus all the functions that we need to navigate to other pages
  return (
    <main>
      <TopNav />
      <div className='container-row centerAlign'>
        <SideNav />
        <div className='tw-flex-grow tw-mx-4 tw-flex tw-flex-col tw-h-full tw-overflow-y-auto'>
          <div ref={dummy}></div>
          <div className="titleBar tw-flex tw-sticky tw-top-0 tw-mb-4 tw-p-2">
            <h1 className="tw-text-white tw-text-2xl tw-font-bold">Forum</h1>
            <button onClick={handleScrollTop} className="tw-absolute tw-mt-2 tw-right-0 tw-text-white hover:tw-text-gray-300">Back to Top</button>
          </div>

          <div className="tw-flex tw-divide-4 tw-w-full tw-my-2">
            <Link to="/my-posts" className="tw-self-center tw-text-white hover:tw-text-gray-300 tw-mr-4 tw-h-min">
              My Posts
            </Link>
            <Link to="/sort-likes" className="tw-self-center tw-text-white hover:tw-text-gray-300 tw-mr-4 tw-h-min">
              Sort by Likes
            </Link>

            <div className='tw-flex tw-flex-row-reverse tw-flex-grow tw-h-10 tw-h-min'>
              <input
                type="text"
                className="tw-text-black tw-rounded-sm tw-p-3 tw-bg-white"
                value={searchTagContent}
                placeholder='Search by Tags'
                onChange={(e) => setSearchTagContent(e.target.value)}
              />
            </div>

            <button
              className="tw-bg-gray-800 hover:tw-bg-gray-600 tw-px-4 tw-py-2 tw-rounded-sm tw-ms-2 tw-text-white"
              onClick={() => {
                setSearchTagContent('');
                handleClearSearch();
                setSearchError('');
                setSearchResultError('');
              }}
            >
              Clear
            </button>

            <button
              className="tw-bg-gray-800 hover:tw-bg-gray-600 tw-px-4 tw-py-2 tw-rounded-sm tw-ms-2 tw-text-white"
              onClick={() => {
                handleSearchTag();
                setIsSearching(true);
              }}
            >
              Search
            </button>
            {searchError && <p className="tw-text-red-500">Search cannot be empty.</p>}
          </div>
          {searchResultError && <p className="tw-text-red-500">No matching posts.</p>}
          <form onSubmit={handleCreatePost} className="tw-mb-4">
            <textarea
              className="tw-text-white txtBox tw-rounded-sm tw-text-black tw-border-solid tw-border-2 tw-border-slate-800 tw-rounded tw-p-2 tw-w-full tw-mb-2 tw-min-h-min"
              placeholder="Post Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            {titleError && <p className="tw-text-red-500">Title cannot be empty.</p>} 
            <textarea
              className="tw-text-white txtBox tw-rounded-sm tw-text-black tw-border-solid tw-border-2 tw-border-slate-800 tw-rounded tw-p-2 tw-w-full tw-h-32 tw-min-h-min"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            {bodyError && <p className="tw-text-red-500">Post body cannot be empty.</p>}
            <button
              className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-w-full tw-p-4 tw-mt-2 tw-text-white"
              type="submit"
            >
              Create Post
            </button>
          </form>
          {!isSearching ? (
            posts.map((post) => (
              <Post key={post.id} post={post} handleSearchTag={handleSearchTag} />
            ))
          ) : (
            filteredPosts.map((post) => (
              <Post key={post.id} post={post} handleSearchTag={handleSearchTag} /> 
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Forum;
