import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ProfilePictureProvider } from './context/ProfilePictureContext'; 
import './firebase'; // Import the Firebase initialization code

import './css/App.css';
import Signin from './components/Signin';
import Signup from './components/Signup';
import PasswordReset from './components/PasswordReset';
import Profile from './components/Profile';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Decide from './pages/Decide';
import Friends from './pages/Friends';
import Chats from './pages/Chats';
import NotFound from './pages/NotFound';

import Forum from './forum/Forum';
import MyPosts from './forum/MyPosts';
import SortLikes from './forum/SortLikes';
import PostDetails from './forum/PostDetails'

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
            
            {/* Friends Page */}
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              }
            />

            {/* Chats */}
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <Chats />
                </ProtectedRoute>
              }
            />

            {/* Forum page */}
            <Route
              path="/forum"
              element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              }
            />

            {/* My Posts page */}
            <Route
              path="/my-posts"
              element={
                <ProtectedRoute>
                  <MyPosts />
                </ProtectedRoute>
              }
            />

            {/* Sort Likes page */}
            <Route
              path="/sort-likes"
              element={
                <ProtectedRoute>
                  <SortLikes />
                </ProtectedRoute>
              }
            />

            { /*post details page*/ }
            <Route
              path="/post-details"
              element={
                <ProtectedRoute>
                  <PostDetails />
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