import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { getAuth } from "firebase/auth";
import Avatar from "@mui/material/Avatar";

export default function TopNav() {
  const { user, logout } = UserAuth();
  const [ url, setUrl ] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();
  const currUser = auth.currentUser;
  
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log('logged out');
    } catch (e) {
      console.log(e.message);
    }
  };


  useEffect(() => {
    if (currUser && currUser.photoURL) {
      setUrl(currUser.photoURL);
    }
  }, [currUser]);



  return (
    <div className="topNav tw-flex tw-align-content-center">
      <div className="login" onClick={handleLogout}>
        Logout
      </div>
      <div>
        <Link to="/profile">
          Profile
        </Link>
      </div>
      
        <Avatar src={url} alt="Profile" sx={{ width: 45, height: 45 }} className="tw-m-2"/>
      
    </div>
  );
}