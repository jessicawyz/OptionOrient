import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import { AuthContextProvider, UserAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  UserAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Signup Component', () => {
  it('should handle form submission', async () => {
    // Create a mock navigate function
    const navigateMock = jest.fn();

    // Mock the UserAuth hook
    const createUserMock = jest.fn();
    UserAuth.mockReturnValue({ createUser: createUserMock });

    // Mock the useNavigate hook
    useNavigate.mockReturnValue(navigateMock);

    const { getByLabelText, getByText } = render(
      <Router>
        <AuthContextProvider>
          <Signup />
        </AuthContextProvider>
      </Router>
    );

    // Simulate user input
    const emailInput = getByLabelText('Email Address');
    const passwordInput = getByLabelText('Password');
    const usernameInput = getByLabelText('Username');
    fireEvent.change(emailInput, { target: { value: 'test@signuptest.com' } });
    fireEvent.change(passwordInput, { target: { value: 'signuppassword' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    // Simulate form submission
    const submitButton = getByText('Sign Up');
    fireEvent.click(submitButton);

    // Assertions
    //expect(navigateMock).toHaveBeenCalledWith('/home');
    expect(createUserMock).toHaveBeenCalledWith('test@signuptest.com', 'signuppassword', 'testuser');
  });
});
