import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';


const ProtectedRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    if (!loading && !user) {
        return <Navigate to='/' />;
    }
    return children;
};

export default ProtectedRoute;