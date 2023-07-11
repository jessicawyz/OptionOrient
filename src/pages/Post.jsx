import React, { useState, useEffect } from 'react';
import { deleteDoc, updateDoc, arrayUnion, setDoc, doc, collection, onSnapshot } from 'firebase/firestore';
import { increment } from 'firebase/firestore';
import { firestore } from '../firebase';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { UserAuth } from '../context/AuthContext';

function Post({ post }) {
  const [newCommentContent, setNewCommentContent] = useState('');
  const [newTagContent, setNewTagContent] = useState('');
  const [searchTagContent, setSearchTagContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { user } = UserAuth();

  const handleDeletePost = async () => {
    const postDoc = doc(firestore, 'posts', post.id);

    await deleteDoc(postDoc);
  };

  const handleLikePost = async () => {
    const postDoc = doc(firestore, 'posts', post.id);

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
    const postDoc = doc(firestore, 'posts', post.id);

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
      const postDoc = doc(firestore, 'posts', post.id);

      await updateDoc(postDoc, {
        comments: arrayUnion({ content: newCommentContent }),
      });

      setNewCommentContent('');
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (newTagContent) {
      const postDoc = doc(firestore, 'posts', post.id);
  
      await updateDoc(postDoc, {
        tag: [...post.tag, newTagContent],
      });
  
      setNewTagContent('');
    }
  };
  
  useEffect(() => {
    const postsCollection = collection(firestore, 'posts');
    const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
      const postsData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setFilteredPosts(postsData);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <h2>{post.title}</h2>
      {isEditing ? (
        <textarea
          className="tw-text-black"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p>{post.content}</p>
      )}
      {user.uid === post.userId && (
        <div>
          {isEditing ? (
            <>
              <button
                className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-4 tw-mt-2 tw-text-white"
                onClick={handleSavePost}
              >
                Save
              </button>
              <button
                className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-4 tw-mt-2 tw-text-white"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-4 tw-mt-2 tw-text-white"
              onClick={handleEditPost}
            >
              Edit
            </button>
          )}
          <button
            className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-4 tw-mt-2 tw-text-white"
            onClick={handleDeletePost}
          >
            Delete
          </button>
        </div>
      )}
      <button
        className="tw-mt-2 tw-flex tw-items-center tw-text-red-500 relative"
        onClick={handleLikePost}
      >
        {post.likedBy && post.likedBy.includes(user.uid) ? (
          <FaHeart size={20} />
        ) : (
          <FaRegHeart size={20} />
        )}
        <span className="tw-ml-2">{post.likes}</span>

        {post.tag && post.tag.length > 0 && (
        
        <div className="tw-ml-4 tw-flex">
          {post.tag.map((tag, index) => (
            <p key={index} className="tw-border-2 tw-mr-2">
            {tag.content}
            </p>
          ))}
        </div>
        )}

      </button>
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

      {post.comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Post;
