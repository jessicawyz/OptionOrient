import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
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
  const [newTagContent, setNewTagContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  
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

  const handleCreateTag = async (e, post) => {
    e.preventDefault();
    if (newTagContent) {
      const postDoc = doc(firestore, 'posts', post.postId);
      const updatedTags = Array.isArray(post.tag) ? [...post.tag] : [];
  
      updatedTags.push({ content: newTagContent });
  
      await updateDoc(postDoc, {
        tag: updatedTags,
      });
      setNewTagContent('');
    }
  };

  const handleSavePost = async (post) => {
    const postDoc = doc(firestore, 'posts', post.postId);

    await setDoc(postDoc, { content: editedContent }, { merge: true });
    setIsEditing(false);
  };

  const handleCancelEdit = (post) => {
    setIsEditing(false);
    setEditedContent(post.content);
  };

  const handleEditPost = async () => {
    setIsEditing(true);
  };

  const handleDeletePost = async (post) => {
    const postDoc = doc(firestore, 'posts', post.postId);
    await deleteDoc(postDoc);
  };


  return (
    <main>
      <TopNav />
      <div className='container-row tw-flex'>
        <SideNav />
        <div className='tw-ml-2 tw-text-white tw-flex-grow tw-mx-4 tw-flex tw-flex-col tw-h-full tw-overflow-y-auto'>
          <div ref={dummy}></div>
          <div className="titleBar tw-flex tw-sticky tw-top-0 tw-mb-4 tw-p-2">
              <h1 data-testid="forum-title" className="tw-text-white tw-text-2xl tw-font-bold">Forum</h1>
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
          posts.map((post) => (
            <div>
              <Post key={post.postId} post={post} /> 
              <form className='' onSubmit={(e) => handleCreateTag(e, post)}>
                  <input
                    type="text"
                    className="tw-h-full tw-p-2 tw-text-white txtBox tw-rounded-sm tw-text-black tw-border-solid tw-border-2 tw-border-slate-800"
                    value={newTagContent}
                    onChange={(e) => setNewTagContent(e.target.value)}
                  />
                  <button
                    className="tw-border tw-border-gray-800 tw-ml-2 tw-bg-gray-800 hover:tw-bg-gray-600 tw-rounded-sm tw-p-2 tw-px-6 tw-mt-2 tw-text-white"
                    type="submit"
                  >
                    Add Tag
                  </button>
              </form>
            <div>
            <div>
              {isEditing ? (
                <textarea
                  className="txtBox tw-rounded-sm tw-text-black tw-border-solid tw-border-2 tw-border-slate-800 tw-mt-8 tw-text-white tw-p-4 "
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              ) : (
                <p></p>
              )}
            </div>
            {isEditing ? (
              <>
                <button
                  className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-2 tw-mt-2 tw-text-white tw-m-2 tw-rounded-sm tw-p-4"
                  onClick={() => handleSavePost(post)}
                >
                  Save
                </button>
                <button
                  className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-2 tw-mt-2 tw-text-white tw-m-2 tw-rounded-sm tw-p-4"
                  onClick={() => handleCancelEdit(post)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-2 tw-mt-2 tw-text-white tw-m-2 tw-rounded-sm tw-p-4"
                onClick={() => handleEditPost()}
                data-testid="edit-button"
              >
                Edit
              </button>
            )}
            <button
              className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-2 tw-mt-2 tw-text-white tw-m-2 tw-rounded-sm tw-p-4"
              onClick={() => handleDeletePost(post)}
              data-testid="delete-button"
            >
              Delete
            </button>
          </div>
          </div>
          ))
          )
            }
            </div>
            </div>
            </main>
  )
          }
            

export default MyPosts;
