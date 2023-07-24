import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import Post from './Post';

jest.mock('../context/AuthContext', () => ({
  UserAuth: jest.fn(),
}));

describe('Post Component', () => {
  const mockPost = {
    id: 'postId',
    username: 'Test User',
    title: 'Test Post',
    content: 'This is a test post.',
    likedBy: [],
    likes: 0,
    comments: [],
    tag: [],
  };

  test('renders Post component without errors', () => {
    UserAuth.mockReturnValue({
      user: {
        displayName: 'Test User',
        uid: 'testUserId',
      },
    });

    render(
      <Router>
        <Post post={mockPost} />
      </Router>
    );
  });

  test('clicking "Like" button triggers handleLikePost', () => {
    UserAuth.mockReturnValue({
      user: {
        displayName: 'Test User',
        uid: 'testUserId',
      },
    });

    const { getByText } = render(
      <Router>
        <Post post={mockPost} />
      </Router>
    );

    const likeButton = getByText('0'); 
    fireEvent.click(likeButton);
  });

  test('clicking "Edit" button triggers handleEditPost', () => {
    UserAuth.mockReturnValue({
      user: {
        displayName: 'Test User',
        uid: 'testUserId',
      },
    });

    const { getByText } = render(
      <Router>
        <Post post={mockPost} />
      </Router>
    );

    const editButton = getByText('Edit');
    fireEvent.click(editButton);

  });

  test('clicking "Delete" button triggers handleDeletePost', () => {
    UserAuth.mockReturnValue({
      user: {
        displayName: 'Test User',
        uid: 'testUserId',
      },
    });

    const { getByText } = render(
      <Router>
        <Post post={mockPost} />
      </Router>
    );

    const deleteButton = getByText('Delete');
    fireEvent.click(deleteButton);
  });

});
