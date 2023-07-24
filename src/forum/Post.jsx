import React, { useState, useEffect, useRef } from 'react';
import { deleteDoc, updateDoc, arrayUnion, setDoc, doc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { increment } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { UserAuth } from '../context/AuthContext';
import { getDownloadURL, ref } from "firebase/storage";
import { Link } from 'react-router-dom';
import '../css/Forum.css'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Avatar from "@mui/material/Avatar";

function Post({ post, handleSearchTag }) {
  const [newCommentContent, setNewCommentContent] = useState('');
  const [newTagContent, setNewTagContent] = useState('');
  const [searchTagContent, setSearchTagContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [photoURL, setPhotoURL] = useState(null);
  const { user } = UserAuth();



  const handleDeletePost = async () => {
    const postDoc = doc(firestore, 'posts', post.postId);
    await deleteDoc(postDoc);
  };

  const handleLikePost = async () => {
    const postDoc = doc(firestore, 'posts', post.postId);

    if (post.likedBy && post.likedBy.includes(user.uid)) {
      // User already liked the post, so unlike it
      const updatedLikedBy = post.likedBy.filter((userId) => userId !== user.uid);

      await updateDoc(postDoc, {
        likedBy: updatedLikedBy,
        likes: increment(-1),
      });
    } else {
      // User hasn't liked the post, so like it
      let updatedLikedBy = [];

      if (post.likedBy && post.likedBy.length > 0) {
        updatedLikedBy = post.likedBy.slice();
      }

      updatedLikedBy.push(user.uid);

      await updateDoc(postDoc, {
        likedBy: updatedLikedBy,
        likes: increment(1),
      });
    }
  };

  const handleEditPost = async () => {
    setIsEditing(true);
  };

  const handleSavePost = async () => {
    const postDoc = doc(firestore, 'posts', post.postId);

    await setDoc(postDoc, { content: editedContent }, { merge: true });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(post.content);
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (newCommentContent) {
      const postDoc = doc(firestore, 'posts', post.postId);

      await updateDoc(postDoc, {
        comments: arrayUnion({ content: newCommentContent }),
      });

      setNewCommentContent('');
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (newTagContent) {
      const postDoc = doc(firestore, 'posts', post.postId);
      await updateDoc(postDoc, {
        tag: [...post.tag, { content: newTagContent }],
      });
      setNewTagContent('');
    }
  };



  const handleTagClick = (tag) => {
    console.log('this is a tag click')
    handleSearchTag(tag.content); 
  };


  /*useEffect(() => {
    const postsCollection = collection(firestore, 'posts');
    const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
      const postsData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setFilteredPosts(postsData);
    });
    return unsubscribe;
  }, []);*/

  useEffect(() => {
    if (post.userId) {
      const imageRef = ref(storage, `/images/${post.userId}/profileImage`);
      getDownloadURL(imageRef)
        .then((url) => {
          setPhotoURL(url);
        })
        .catch((error) => {
          console.log("Error fetching profile picture:", error);
        });
    }
  }, [post.userId]);

  return (
    <div>
    <Card sx={{ minWidth: 275, minHeight: 20, zIndex: 'modal' }} className='tw-mb-6 postCard'>
  <CardContent className="tw-h-full">
    <Link to='/post-details' state={{post: post}}>
    {photoURL && (
      <div className='tw-flex tw-flex-row'>
        <Avatar
          src={photoURL}
          alt="Profile"
          sx={{ width: 30, height: 30 }}
          className='tw-me-2'
        />
        <Typography sx={{ fontSize: 14 }} className='tw-text-slate-200' gutterBottom>
          <div className='tw-mt-1'>{`${post.username}`}</div>
        </Typography>
      </div>
    )}

    <Typography data-testid="post-title" variant="h5" className='tw-font-bold tw-text-white tw-mb-4' component="div">
      {post.title.length > 40 ? 
        (
          `${post.title.substring(0, 40)}...`
        ) : (
          `${post.title}`
        )}
    </Typography>

    <Typography data-testid="post-content" sx={{ mb: 1.5 }} className='tw-text-gray-400 tw-break-words'>
      {post.content.length > 400 ? 
        (`${post.content.substring(0, 400)}...`) : (
          `${post.content}`
        )}
    </Typography>
    </Link>


    <div className="tw-flex tw-flex-row">
      <button data-testid="like-button" className="tw-mt-2 tw-flex tw-items-center tw-text-red-500 likeButton" onClick={handleLikePost}>
        {post.likedBy && post.likedBy.includes(user.uid) ? (
          <FaHeart size={20} />
        ) : (
          <FaRegHeart size={20} />
        )}
        <span className="tw-ml-2">{post.likes}</span>
      </button>
      
      <LocalOfferIcon className="tw-mt-3 tw-flex tw-items-center tw-text-black tw-ms-6 tw-text-white" />

      {post.tag && post.tag.length > 0 ? (
        <span className="tw-flex tw-flex-wrap tw-items-center">
        {post.tag.map((tag, index) => (
          <span key={index} className="tag tw-mt-2 tw-text-white tw-ms-2 tw-p-1 tw-flex tw-items-center tw-rounded-full tw-px-2">
            {tag.content}
          </span>
        ))}
        </span>
      ) : (
        <p className="tw-mt-2 tw-ms-1 tw-p-1 tw-flex tw-items-center tw-text-gray-300">
          No tags yet
        </p>
      )}
    </div>
  </CardContent>
  </Card>

      
    </div>
  );
}

export default Post;
