import React, { useState } from 'react';
import { deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { doc, increment } from 'firebase/firestore';
import { firestore } from '../firebase';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

function Post({ post }) {
  const [newCommentContent, setNewCommentContent] = useState('');
  const [liked, setLiked] = useState(false);

  const handleDeletePost = async () => {
    const postDoc = doc(firestore, 'posts', post.id);

    await deleteDoc(postDoc);
  };

  const handleLikePost = async () => {
    const postDoc = doc(firestore, 'posts', post.id);

    await updateDoc(postDoc, {
      likes: increment(1),
    });
    setLiked(true);
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

  return (
    <div key={post.id}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <button
        className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-p-4 tw-mt-2 tw-text-white"
        onClick={handleDeletePost}
      >
        Delete Post
      </button>
      <button
        className="tw-mt-2 tw-flex tw-items-center tw-text-red-500"
        onClick={handleLikePost}
      >
        {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        <span className="tw-ml-2">{post.likes}</span>
      </button>
      <form onSubmit={handleCreateComment}>
        <textarea
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
      {post.comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Post;
