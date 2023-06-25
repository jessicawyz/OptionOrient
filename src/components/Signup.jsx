import { UserAuth } from '../context/AuthContext';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { createUser } = UserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    try {
      // Create the user account
      await createUser(email, password, username);
      navigate('/home');
      console.log('success!');
    } catch (e) {
      if (e.message === 'Error creating user: Firebase: Error (auth/email-already-in-use).') {
        setError('Email address is already in use');
      } else {
        console.log(e.code);
        setError(e.message);
      }
      console.log(e);
    }
  };

  return (
    <div className="tw-flex tw-justify-center">
      <div className="tw-basis-3/4 tw-m-5">
        <div>
          <h1 className="tw-text-2xl tw-font-bold tw-py-2 tw-text-white">Make your decision today! Sign up for an account</h1>
          <p className="tw-py-2">
            Already have an account?{' '}
            <Link to="/" className="links">
              Sign in.
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="tw-flex tw-flex-col tw-py-2">
            <label htmlFor="emailInput" className="tw-py-2 tw-font-medium tw-text-white">Email Address</label>
            <input
              id="emailInput"
              onChange={(e) => setEmail(e.target.value)}
              className="tw-border tw-p-3"
              type="email"
            />
          </div>

          {error && error === 'Email address is already in use' && <p className="tw-text-red-500">{error}</p>}

          <div className="tw-flex tw-flex-col tw-py-2">
            <label htmlFor="passwordInput" className="tw-py-2 tw-font-medium tw-text-white">Password</label>
            <input
              id="passwordInput"
              onChange={(e) => setPassword(e.target.value)}
              className="tw-border tw-p-3"
              type="password"
            />
          </div>

          {error && error === 'Email address is already in use' && <p className="tw-text-red-500">{error}</p>}

          <div className="tw-flex tw-flex-col tw-py-2">
            <label htmlFor="usernameInput" className="tw-py-2 tw-font-medium tw-text-white">Username</label>
            <input
              id="usernameInput"
              onChange={(e) => setUsername(e.target.value)}
              className="tw-border tw-p-3"
              type="text"
            />
          </div>

          <button className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-w-full tw-p-4 tw-my-2 tw-text-white">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
