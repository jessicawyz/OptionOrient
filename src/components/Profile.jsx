import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { storage, useAuth } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile, getAuth } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import { upload } from '@testing-library/user-event/dist/upload';

const Profile = () => {
  const { user, logout } = UserAuth();
  const [ userData, setUserData] = useState(null);    
  const [ image, setImage ] = useState(null);
  const [ photoURL, setPhotoURL ] = useState(null);
  
  const currUser = useAuth();

  
  const navigate = useNavigate();
  // logout function
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
      const fetchUserData = async () => {
        if (user && user.email && user.displayName) {
          setUserData({ email: user.email, username: user.displayName });
        }
      };
    
      fetchUserData();
    }, [user]);


  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
      if (file) {
        setImage(file);
        uploadImage(file);
      }
    };

    async function uploadImage(file) {
      const imageRef = ref(storage, `/images/${currUser.uid}/profileImage`);
  
      const snapshot = await uploadBytes(imageRef, file);
      const photoURL = await getDownloadURL(imageRef);

      updateProfile(currUser, {photoURL});
      alert("uploaded image!");
      window.location.reload(true);
    }

      useEffect(() => {
        if (currUser?.photoURL) {
          setPhotoURL(currUser.photoURL);
        }
      }, [currUser])
        
    return (
        <div>
          {userData ? (
            <div>
              <h2 className="tw-text-2xl tw-font-bold tw-py-2 tw-text-white">Profile</h2>
    
              <div className="tw-flex tw-items-center tw-mb-8">
                <div>
                  <Avatar alt="Profile" sx={{ width: 100, height: 100 }} src={photoURL} className="tw-my-8"/>
                  {/* Profile picture upload button */}
                  <input type="file" onChange={handleProfilePictureUpload} />
                </div>
    
                <div>
                  {/* Display the username */}
                  <p className="tw-font-medium tw-text-white">Username: {userData.username}</p>
                  {/* Display the email */}
                  <p className="tw-font-medium tw-text-white">Email: {userData.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
    
          {/* Logout button */}
          <button
            className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-w-20 tw-p-4 tw-mt-auto tw-text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
    
          {/* Home button */}
          <Link
            to="/home"
            className="tw-border tw-border-gray-800 tw-bg-gray-800 hover:tw-bg-gray-600 tw-w-20 tw-p-4 tw-mt-4 tw-text-white"
          >
            Home
          </Link>
        </div>
      );
    };
    
    export default Profile;
  