import React, { useEffect, useState, useContext } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import md5 from 'blueimp-md5';
import { ProfilePictureContext } from '../context/ProfilePictureContext';

const Profile = () => {
  const { user, logout } = UserAuth();
  const [userData, setUserData] = useState(null);
  const { profilePicture, setProfilePicture, updateProfilePicture } = useContext(ProfilePictureContext); 
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

  // Function to generate a default profile picture URL based on the user's email
  const generateDefaultProfilePictureURL = (email) => {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.email && user.displayName) {
        setUserData({ email: user.email, username: user.displayName });
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (profilePicture) {
      setProfilePicture(profilePicture);
    }
  }, [profilePicture]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
        if (user && user.email) {
          try {
            // Fetch the profile picture URL from the backend route or generate a default URL
            const response = await fetch('/profile-pic');
            const data = await response.json();
            if (data.profilePictureURL) {
              setProfilePicture(data.profilePictureURL);
            } else {
              const defaultPictureURL = generateDefaultProfilePictureURL(user.email);
              setProfilePicture(defaultPictureURL);
            }
          } catch (error) {
            console.log('Error fetching profile picture:', error);
            const defaultPictureURL = generateDefaultProfilePictureURL(user.email);
            setProfilePicture(defaultPictureURL);
          }
        } else {
          setProfilePicture(null);
        }
      };

    fetchProfilePicture();
  }, [user]);

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];

    updateProfilePicture(file);
  };

  return (
    <div>
      {userData ? (
        <div>
          <h2 className="tw-text-2xl tw-font-bold tw-py-2 tw-text-white">Profile</h2>

          <div className="tw-flex tw-items-center tw-mb-8">
            <div>
              {/* Display the profile picture as a circular image */}
              <div className="tw-w-20 tw-h-20 tw-rounded-full tw-overflow-hidden tw-mr-4">
                <img src={profilePicture} alt="Profile" className="tw-w-full tw-h-full" />
              </div>
              {/* Profile picture upload button */}
              <input type="file" accept="image/*" onChange={handleProfilePictureUpload} />
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