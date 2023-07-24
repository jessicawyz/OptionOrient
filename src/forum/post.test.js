import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import Post from './Post';

jest.mock('../context/AuthContext', () => ({
  UserAuth: jest.fn(),
}));

describe('Post Component', () => {
  const mockPost = {
    // Provide the necessary data for a post, including user ID as the owner of the post
    id: 'postId',
    username: 'Test User',
    title: 'Test Post',
    content: 'This is a test post.',
    likedBy: [],
    likes: 0,
    comments: [],
    tag: [],
    userId: 'testUserId', // Assuming this matches the user ID returned by UserAuth mock
  };

  beforeEach(() => {
    UserAuth.mockReturnValue({
      user: {
        displayName: 'Test User',
        uid: 'testUserId',
      },
    });
  });

  test('renders Post component without errors', () => {
    render(
      <Router>
        <Post post={mockPost} />
      </Router>
    );
  });

  test('clicking "Like" button triggers handleLikePost', () => {
    render(
      <Router>
        <Post post={mockPost} />
      </Router>
    );

    // Use getByTestId to find the like button
    const likeButton = screen.getByTestId('like-button');

    fireEvent.click(likeButton);
  });

  test('clicking "Edit" button triggers handleEditPost', () => {
    const { getByTestId } = render(
      <Router>
        <Post post={mockPost} />
      </Router>
    );

    const editButton = getByTestId('edit-button');
    fireEvent.click(editButton);
  });

  test('clicking "Delete" button triggers handleDeletePost', () => {
    const { getByTestId } = render(
      <Router>
        <Post post={mockPost} />
      </Router>
    );

    const deleteButton = getByTestId('delete-button');
    fireEvent.click(deleteButton);
  });

  test('displays the correct title and content', () => {
    render(
      <Router>
        <Post post={mockPost} />
      </Router>
    );

    const titleElement = screen.getByTestId('post-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent(mockPost.title);

    const contentElement = screen.getByTestId('post-content');
    expect(contentElement).toBeInTheDocument();
    expect(contentElement).toHaveTextContent(mockPost.content);
  });
});
