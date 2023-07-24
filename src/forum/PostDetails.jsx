import React, { useState, useEffect, useRef } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { doc, setDoc, updateDoc, getDoc, increment, collection, onSnapshot, arrayUnion } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../firebase';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import Avatar from "@mui/material/Avatar";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useLocation } from 'react-router-dom';

export default function PostDetails() {
    const [post, setPost] = useState(null);
    const [postId, setPostID] = useState([]);
    const [user, loading] = useAuthState(auth);
    const [uid, setUid] = useState("");
    const [username, setUsername] = useState("");
    const [authorURL, setAuthorURL] = useState("");
    const [updatingLikes, setUpdatingLikes] = useState(false);
    const [anchor, setAnchor] = useState(null);
    const [newCommentContent, setNewCommentContent] = useState("");
    const [newTagContent, setNewTagContent] = useState('');
    const [isEditingCom, setIsEditingCom] = useState([]);
    const [editedComContent, setEditedComContent] = useState(""); 
    const location = useLocation();
    const data = location.state;

    const open = Boolean(anchor);

    const dummy = useRef();

    useEffect(() => {
        if (user) {
            setUsername(user.displayName);
            setUid(user.uid);
        }
    }, [user]);

    useEffect(() => {
        try {
          if (data) {
            setPost(data.post);
            setPostID(data.postId);
          }
        } catch(e) {
          console.log('Error getting post details' + e.message);
        }
      }, [user]);

      useEffect(() => {
        const savedPost = JSON.parse(localStorage.getItem('post'));
        if (savedPost) {
            setPost(savedPost);
        }
    }, []);

      useEffect(() => {
        if (post) {
            localStorage.setItem('post', JSON.stringify(post));
        }
        }, [post]);



      useEffect(() => {
        try {
            if (data) {
                getPfp(data.post.username);
            }
        } catch(e) {
            console.log('Error getting author profile: ' + e.message);
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            const postsCollection = doc(firestore, 'posts', data.post.postId);
            const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
                setPost(snapshot.data());
            })
                
            
            return () => unsubscribe();
            };
            
    }, [data]);

    const handleLikePost = async () => {
        setUpdatingLikes(true);
        const postDoc = doc(firestore, 'posts', post.postId);
    
        if (post.likedBy && post.likedBy.includes(uid)) {
          // User already liked the post, so unlike it
          const updatedLikedBy = post.likedBy.filter((userId) => userId !== uid);
    
          await updateDoc(postDoc, {
            likedBy: updatedLikedBy,
            likes: increment(-1),
          });
        } else {
          // User hasn't liked the post, so like it
          let updatedLikedBy = [];
    
          if (post && post.likedBy && post.likedBy.length > 0) {
            updatedLikedBy = post.likedBy.slice();
          }
    
          updatedLikedBy.push(uid);
    
          await updateDoc(postDoc, {
            likedBy: updatedLikedBy,
            likes: increment(1),
          });
        }
        setUpdatingLikes(false);
      };
    

      function handleScrollTop() {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    
      }

      async function getPfp(u) {
        if (data) {
            const friendRef = doc(firestore, `${u}`, 'info');
            const docSnap = await getDoc(friendRef);
            setAuthorURL(docSnap.data().photoURL);
        }

        return authorURL;
      }

      function handleClose() {
        setAnchor(null);
      }

      const handleOpenTags = (e) => {
        setAnchor(e.currentTarget);
      }

      const handleCreateComment = async (e) => {
        e.preventDefault();
        if (newCommentContent) {
          const postDoc = doc(firestore, 'posts', post.postId);
    
          await updateDoc(postDoc, {
            comments: arrayUnion({ author: user.displayName, content: newCommentContent }),
          });
    
          setNewCommentContent('');
        }
      };

      const handleCreateTag = async (e) => {
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
      
      function handleEditComment(index) {
        /*setEditedComContent(post.comments[index].content);
        const tempArray = isEditingCom;
        tempArray[index] = true;
        setIsEditingCom(tempArray);*/
      }

      async function handleSaveComment(index) {
        const postDoc = doc(firestore, 'posts', post.id);
        const tempArray = post.comments;
        tempArray[index].content = editedComContent;

        await setDoc(postDoc, { comments: tempArray });
        const editTemp = isEditingCom;
        editTemp[index] = false;
        setIsEditingCom(editTemp);

      }

      function handleCancelComment(index) {
        const tempArray = isEditingCom;
        tempArray[index] = false;
        setIsEditingCom(tempArray);
      }

    return (
        <main>
            { post == null ? (<p>loading...</p>) : (
            <div className='container-row tw-flex'>
              <SideNav />
              <div className='tw-flex-grow tw-mx-4 tw-flex tw-flex-col tw-overflow-y-auto'>
                <div ref={dummy}></div>
                <div className='tw-flex tw-flex-row'>
                    <Avatar
                        src={authorURL}
                        alt="Profile"
                        sx={{ width: 80, height: 80 }}
                        className='tw-me-2'
                    />
                    <div className='tw-mx-4 tw-flex tw-flex-col tw-w-full'>
                        <div className=' tw-tracking-wide tw-text-white tw-font-bold tw-text-3xl tw-'>
                            {post.title}
                        </div>
                        <div className='tw-text-gray-500'>Posted by {post.username}</div>
                        <div className='tw-flex tw-flex-row-reverse'>
                        <div className='tw-flex tw-flex-row-reverse tw-w-1/3'>
                        <button className="tw-mt-2 tw-flex tw-items-center tw-text-red-500" onClick={handleLikePost}>
                            {post.likedBy && post.likedBy.includes(uid) ? (
                                <FaHeart size={20} />
                            ) : (
                                <FaRegHeart size={20} />
                            )}
                            <span className="tw-ml-2">{post.likes}</span>
                            </button>
                            <LocalOfferIcon onClick={handleOpenTags} className="tw-mx-4 tw-mt-2 tw-flex tw-items-center tw-text-black tw-ms-6 tw-text-white" />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchor}
                                open={open}
                                onClose={handleClose}
                                >
                                    {post.tag && post.tag.length > 0 ? (
                                        <div className="tw-flex tw-flex-col tw-max-h-16 tw-max-w-sm tw-overflow-y-auto">
                                            { post.tag.map((tag, index) => (
                                            <MenuItem key={index} className='tw-w-full tw-text-center'>
                                            {tag.content}
                                            </MenuItem>
                                            )) }
                                        </div>
                                        ) : (
                                            <MenuItem>no tags added</MenuItem>
                                        )}
                            </Menu>
                            </div>
                        </div>
                    </div>

                    
                        
                </div>

                <div className='tw-border-solid tw-border-2 tw-border-slate-800 tw-rounded-md tw-p-4 tw-mb-6 tw-mt-4 contentCard tw-min-h-max'>
                        <div className="tw-h-full">
                            <div className='tw-text-gray-200'>
                                {post.content}
                            </div>
                        </div>
                </div>

                <div className='tw-my-4'>
                    <div className='tw-text-white tw-tx-lg tw-mb-2 tw-font-bold tw-p-1'>Comments</div>
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment, index) => (
                            <div>
                            {isEditingCom[index] ? (
                                <div className='contentCard tw-border-solid tw-border-2 tw-border-slate-800 tw-rounded-md tw-p-4 tw-min-h-max'>
                                <textarea
                                    className="tw-text-white tw-h-full tw-w-full contentCard"
                                    value={editedComContent}
                                    onChange={(e) => setEditedComContent(e.target.value)}/>
                                <div className='tw-text-slate-400 tw-w-full tw-flex tw-flex-row-reverse'>
                                    <button className='tw-ml-6' onClick={handleCancelComment(index)}>cancel</button>
                                    <button onClick={handleSaveComment(index)}>save</button>
                                </div>
                                </div>
                            ) : (
                                <div key={comment.id} className='tw-mb-4 tw-text-white contentCard tw-border-solid tw-border-2 tw-border-slate-800 tw-rounded-md tw-p-4 tw-min-h-max'>
                                {comment.content}
                                <div className='tw-w-full tw-flex tw-flex-row-reverse tw-text-sm tw-text-slate-400'>
                                    <div> | by {comment.author}</div>
                                    {comment.author === user.displayName ? (<button onClick={() => handleEditComment(index)} className='tw-mx-2'>Edit </button>) : (<p></p>)}
                                </div>
                            </div>
                            )}
                            </div>
                            
                        ))
                    ) : (
                        <p className='tw-text-white'>No comments yet!</p>
                    )}
                </div>

                <form onSubmit={handleCreateComment}>
                <textarea
                    className="tw-text-black"
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                />
                <button
                    className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-4 tw-mt-2 tw-text-white"
                    type="submit"
                >
                    Add Comment
                </button>
                </form>

                <form onSubmit={handleCreateTag}>
          <input
            type="text"
            className="tw-text-black"
            value={newTagContent}
            onChange={(e) => setNewTagContent(e.target.value)}
          />
          <button
            className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-4 tw-mt-2 tw-text-white"
            type="submit"
          >
            Add Tag
          </button>
        </form>
                
              </div>
              
              
              <TopNav />
            </div>
            )}
        </main>
    )

}