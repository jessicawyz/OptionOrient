import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ProfilePictureProvider } from './context/ProfilePictureContext'; 
import './firebase'; // Import the Firebase initialization code

import './App.css';
import Signin from './components/Signin';
import Signup from './components/Signup';
import PasswordReset from './components/PasswordReset';
import Profile from './components/Profile';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Decide from './pages/Decide';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthContextProvider>
      <ProfilePictureProvider> {/* Wrap the ProfilePictureProvider */}
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Login */}
            <Route index element={<Signin />} />
            <Route path="/signup" element={<Signup />} />

            {/* Password Reset */}
            <Route path="/password-reset" element={<PasswordReset />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />

            {/* Home */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Decide page */}
            <Route
              path="/decide"
              element={
                <ProtectedRoute>
                  <Decide />
                </ProtectedRoute>
              }
            />

            <Route path="/notFound" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ProfilePictureProvider>
    </AuthContextProvider>
  );
}

export default App;