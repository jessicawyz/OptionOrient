import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Signin from './Signin';
import { AuthContextProvider, UserAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  UserAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Signin Component', () => {
  it('should handle form submission', async () => {
    // Create a mock navigate function
    const navigateMock = jest.fn();

    // Create a mock signIn function
    const signInMock = jest.fn();

    // Mock the UserAuth hook
    UserAuth.mockReturnValue({ signIn: signInMock });

    // Mock the useNavigate hook
    useNavigate.mockReturnValue({ navigate: navigateMock });

    const { getByLabelText, getByText } = render(
      <Router>
        <AuthContextProvider>
          <Signin />
        </AuthContextProvider>
      </Router>
    );

    // Simulate user input
    const emailInput = getByLabelText('Email Address');
    const passwordInput = getByLabelText('Password');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passwordfortest' } });

    // Simulate form submission
    const submitButton = getByText('Sign In');
    fireEvent.click(submitButton);

    // Assertions
    expect(signInMock).toHaveBeenCalledWith('test@test.com', 'passwordfortest');
    //expect(navigateMock).toHaveBeenCalledWith('/home');
  });
});
