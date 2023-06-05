import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './firebase'; // Import the Firebase initialization code

import "./App.css"
import Signin from './components/Signin';
import Signup from './components/Signup';
import PasswordReset from './components/PasswordReset';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Decide from "./pages/Decide";
import NotFound from "./pages/NotFound";


function App() {
  return (
    
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/*Login*/}
          <Route index element={<Signin />} />
          <Route path='/signup' element={<Signup />} />

          {/* Password Reset */}
          <Route path="/password-reset" element={<PasswordReset />} />

          {/* Home */}
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          
          {/*decide page*/}
          <Route 
            path="/decide" 
            element={
              <ProtectedRoute>
                <Decide />
              </ProtectedRoute>
            } 
          />
          <Route path="/notFound" element={<NotFound />} />

        </Route>
      </Routes>
    </AuthContextProvider>
    
  );
}

export default App;