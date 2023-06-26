import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    try {
      await signIn(email, password)
      navigate('/home')
    } catch (e) {
      if (e.message === 'Error signing in: Firebase: Error (auth/user-not-found).') {
        setError('You have not signed up yet!');
      } else if (e.message === 'Error signing in: Firebase: Error (auth/wrong-password).') {
        setError('You have entered a wrong password!');
      } else if (e.message === 'Error signing in: Firebase: Error (auth/missing-password).') {
        setError('Please enter a password!');
      } else {
      setError(e.message)
      console.log(e.message)
      }
    }
  };

  return (
    <div className='tw-flex tw-justify-center'>
    <div className='tw-basis-3/4 tw-m-5'>
      <div>
        <h1 className='tw-text-2xl tw-font-bold tw-py-2 tw-text-white'>Sign in to your account</h1>

        <p className='tw-py-3'>
          Don't have an account yet?{' '}
          <Link to='/signup' className='links'>
            Sign up.
          </Link>
        </p>

      </div>
      {error && <p className='tw-text-red-500'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='tw-flex tw-flex-col tw-py-2'>
          <label htmlFor="emailInput" className='tw-py-2 tw-font-medium tw-text-white'>Email Address</label>
          <input id="emailInput" onChange={(e) => setEmail(e.target.value)} className='tw-border tw-p-3' type='email' />
        </div>
        <div className='tw-flex tw-flex-col tw-py-2'>
          <label htmlFor="passwordInput" className='tw-py-2 tw-font-medium tw-text-white'>Password</label>
          <input id="passwordInput" onChange={(e) => setPassword(e.target.value)} className='tw-border tw-p-3' type='password' />
        </div>
        <button className='tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-w-full tw-p-4 tw-my-2 tw-text-white'>
          Sign In
        </button>
      </form>
      <p className='tw-py-2'>
          Forgot password?{' '}
          <Link to='/password-reset' className='links'>
            Reset Password.
          </Link>
        </p>
    </div>
    </div>
  );
};

export default Signin;