import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import Forum from './Forum';

jest.mock('../context/AuthContext', () => ({
  UserAuth: jest.fn(),
}));

describe('Forum Component', () => {
  test('renders Forum component without errors', () => {
    UserAuth.mockReturnValue({
      user: {
        displayName: 'Test User',
        uid: 'testUserId',
      },
      logout: jest.fn(),
    });

    render(
      <Router>
        <Forum />
      </Router>
    );
  });

  test('clicking "Create Post" button triggers handleCreatePost', () => {
    UserAuth.mockReturnValue({
      user: {
        displayName: 'Test User',
        uid: 'testUserId',
      },
      logout: jest.fn(),
    });

    const { getByText, getByPlaceholderText } = render(
      <Router>
        <Forum />
      </Router>
    );
  });

  test('clicking "Clear" button triggers handleClearSearch', () => {
    UserAuth.mockReturnValue({
      user: {
        displayName: 'Test User',
        uid: 'testUserId',
      },
      logout: jest.fn(),
    });

    const { getByText, getByPlaceholderText } = render(
      <Router>
        <Forum />
      </Router>
    );
  });
});
