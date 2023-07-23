import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { storage, useAuth, firestore } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile, getAuth } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import '../css/Profile.css'

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

      try {
        updateProfile(currUser, {photoURL});
        const dbRef = doc(firestore,`${user.displayName}`, `info`);
        await updateDoc(dbRef, {
          photoURL: photoURL,
        })
        alert("uploaded image!");
        window.location.reload(true);
      } catch (e) {
        console.log("Error uploading profile picture: " + e.message);
      }
    }

      useEffect(() => {
        if (currUser?.photoURL) {
          setPhotoURL(currUser.photoURL);
        }
      }, [currUser])
        
    return (
        <div>
          {userData ? (
            <div className='tw-m-4'>
    
              <div className="tw-flex tw-flex-row tw-mb-8">
                <div className='tw-flex tw-w-1/4 tw-flex-col tw-items-start'>
                  <Avatar alt="Profile" sx={{ width: 150, height: 150 }} src={photoURL} className="tw-my-8"/>
                  {/* Profile picture upload button */}
                  <label className="profileButton tw-p-3 tw-px-6 tw-text-white tw-text-lg tw-rounded-md hover:tw-opacity-90">
                    <input type="file" accept="image/*" onChange={handleProfilePictureUpload} />
                    Upload Photo
                  </label>
                </div>
    
                <div className="tw-m-8">
                  {/* Display the username */}
                  <p className="tw-font-semibold tw-text-2xl tw-text-white tw-mb-6 tw-tracking-wide">Username: {userData.username}</p>
                  {/* Display the email */}
                  <p className="tw-font-medium tw-text-xl tw-text-white">Email: {userData.email}</p>
                  <div className="tw-flex tw-w-max tw-my-8">
                    {/* Logout button */}
                    <button
                      className="profileButton tw-flex-grow tw-my-4 tw-me-10 tw-p-3 tw-px-14 tw-text-white tw-text-lg tw-rounded-md hover:tw-opacity-90"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
              
                    {/* Home button */}
                    <Link
                      to="/home"
                      className="profileButton tw-flex-grow tw-my-4 tw-me-4 tw-p-3 tw-px-14 tw-text-white tw-text-lg tw-rounded-md hover:tw-opacity-90"
                    >
                      Home
                    </Link>
                  </div>
                  </div>
                </div>
              </div>
          ) : (
            <p>Loading...</p>
          )}
          </div>
    
          
      );
    };
    
    export default Profile;
  