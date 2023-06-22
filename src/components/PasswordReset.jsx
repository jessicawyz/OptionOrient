import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setIsResetSent(true);
      setError('');
    } catch (error) {
      setIsResetSent(false);
      setError(error.message);
    }
  };

  return (
    <div className='tw-flex tw-justify-center'>
    <div className='tw-basis-3/4 tw-m-5'>
      <h1 className='tw-text-2xl tw-font-bold tw-py-2 tw-text-white'>Enter your email to receive a password reset email.</h1>
      {isResetSent ? (
        <p>Password reset email sent. Please check your inbox.</p>
      ) : (
        <form onSubmit={handleReset}>
          <div className='tw-flex tw-flex-col tw-py-2'>
            <label className='tw-py-2 tw-font-medium tw-text-white'>Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className='tw-border tw-p-3'
              type='email'
              placeholder='Email'
              value={email}
            />
          </div>
          <button className='tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-w-full tw-p-4 tw-my-2 tw-text-white'>
            Reset Password
          </button>
        </form>
      )}
      {error && <p>{error}</p>}

      <h1 className='tw-text-2xl tw-font-bold tw-py-2 tw-text-white'>Now you can Sign in to your account</h1>

      <p className='tw-py-3'>
        Sign in here with your new password{' '}
        <Link to='/' className='links'>
          Sign in.
        </Link>
      </p>
    </div>
    </div>
  );
};

export default PasswordReset;