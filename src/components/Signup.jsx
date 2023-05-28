import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('')
  const { createUser } = UserAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUser(email, password);
      navigate('/home');
      console.log("success!");
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <div className='max-w-[700px] tw-mx-auto tw-my-16 tw-p-4'>
      <div>
        <h1 className='tw-text-2xl tw-font-bold tw-py-2'>Make your decision today! Sign up for an account</h1>
        <p className='tw-py-2'>
          Already have an account?{' '}
          <Link to='/' className='links'>
            Sign in.
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='tw-flex tw-flex-col tw-py-2 tw-text-white'>
          <label className='tw-py-2 tw-font-medium'>Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className='tw-border tw-p-3'
            type='email'
          />
        </div>
        <div className='tw-flex tw-flex-col tw-py-2 tw-text-white'>
          <label className='tw-py-2 tw-font-medium'>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className='tw-border tw-p-3'
            type='password'
          />
        </div>

        <div className='tw-flex tw-flex-col tw-py-2'>
          <label className='tw-py-2 tw-font-medium tw-text-white'>Username</label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className='tw-border tw-p-3'
            type='username'
          />
        </div>

        <button className='tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-w-full tw-p-4 tw-my-2 tw-text-white'>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;