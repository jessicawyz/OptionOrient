import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from '../context/AuthContext';



export default function TopNav() {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            console.log('logged out')
        } catch (e) {
            console.log(e.message);
        }
    };
    return (
        <div className="topNav">
            <div className="login" onClick={handleLogout}>Logout</div>
            <div className="register">Profile</div>
            <div className="circle"></div>
          </div>
    )
}