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
      setError(e.message)
      console.log(e.message)
    }
  };

  return (
    <div className='max-w-[700px] tw-mx-auto tw-my-16 tw-p-4'>
      <div>
        <h1 className='tw-text-2xl tw-font-bold tw-py-2'>Sign in to your account</h1>

        <p className='tw-py-3'>
          Don't have an account yet?{' '}
          <Link to='/signup' className='links'>
            Sign up.
          </Link>
        </p>

      </div>
      <form onSubmit={handleSubmit}>
        <div className='tw-flex tw-flex-col tw-py-2'>
          <label className='tw-py-2 tw-font-medium tw-text-white'>Email Address</label>
          <input onChange={(e) => setEmail(e.target.value)} className='tw-border tw-p-3' type='email' />
        </div>
        <div className='tw-flex tw-flex-col tw-py-2'>
          <label className='tw-py-2 tw-font-medium tw-text-white'>Password</label>
          <input onChange={(e) => setPassword(e.target.value)} className='tw-border tw-p-3' type='password' />
        </div>
        <button className='tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-w-full tw-p-4 tw-my-2 tw-text-white'>
          Sign In
        </button>
      </form>
      <p className='tw-py-2'>
          Forgot password?{' '}
          <Link to='/notFound' className='links'>
            Reset Password.
          </Link>
        </p>
    </div>
  );
};

export default Signin;