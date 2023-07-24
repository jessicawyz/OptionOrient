import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import MyPosts from './MyPosts';

// Helper function to mock the useNavigate function
const mockUseNavigate = () => {
  const navigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // useNavigate: () => navigate,
  }));
  return navigate;
};

jest.mock('../context/AuthContext', () => ({
  UserAuth: jest.fn(),
}));

describe('MyPosts Component', () => {
  test('renders without any user logged in', () => {
    // Mock the UserAuth context with no user logged in
    UserAuth.mockReturnValue({
      user: null,
    });

    const { getByText } = render(
      <Router>
        <MyPosts />
      </Router>
    );

    const messageElement = getByText(/You have not posted anything yet. Make a post now!/i);
    expect(messageElement).toBeInTheDocument();
  });

  test('renders with user logged in and no posts', () => {
    // Mock the UserAuth context with a logged-in user
    UserAuth.mockReturnValue({
      user: {
        uid: 'user123',
      },
    });

    // Mock Firestore query and snapshot with no posts
    jest.mock('firebase/firestore', () => ({
      collection: jest.fn(),
      query: jest.fn(() => jest.fn()),
      where: jest.fn(() => jest.fn()),
      onSnapshot: jest.fn((query, callback) => {
        // Simulate an empty snapshot
        callback({ docs: [] });
      }),
    }));

    const { getByText } = render(
      <Router>
        <MyPosts />
      </Router>
    );

    const messageElement = getByText(/You have not posted anything yet. Make a post now!/i);
    expect(messageElement).toBeInTheDocument();
  });

  test('handles scroll to top button', () => {
    // Mock the UserAuth context with a logged-in user
    UserAuth.mockReturnValue({
      user: {
        uid: 'user123',
      },
    });

    const { getByText } = render(
      <Router>
        <MyPosts />
      </Router>
    );

    // Mock the scrollIntoView function
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    // Click on the "Back to Top" button
    const backButton = getByText(/Back to Top/i);
    backButton.click();

    // Check if the scrollIntoView function is called
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
  });

  /*test('navigates to the main forum page', () => {
    // Mock the UserAuth context with a logged-in user
    UserAuth.mockReturnValue({
      user: {
        uid: 'user123',
      },
    });

    // Mock the useNavigate function
    const navigateMock = mockUseNavigate();

    const { getByText } = render(
      <Router>
        <MyPosts />
      </Router>
    );

    // Click on the "Main" link
    const mainLink = getByText(/Main/i);
    mainLink.click();

    // Check if the useNavigate function is called with the correct path
    expect(navigateMock).toHaveBeenCalledWith('/forum');
  });*/
});
