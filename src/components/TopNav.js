import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { ProfilePictureContext } from '../context/ProfilePictureContext';
import md5 from 'blueimp-md5';

export default function TopNav() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const { profilePicture, setProfilePicture, updateProfilePicture } = useContext(ProfilePictureContext) || {}; 

  // Log out function
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
  }, [user, setProfilePicture]);


  return (
    <div className="topNav">
      <div className="login" onClick={handleLogout}>
        Logout
      </div>
      <div>
        <Link to="/profile" className="links">
          Profile
        </Link>
      </div>
      <div className="tw-flex tw-items-center tw-mb-8">
        <div>
          {/* Display the profile picture as a smaller circular image */}
          <div className="tw-w-12 tw-h-12 tw-rounded-full tw-overflow-hidden tw-ml-2 tw-mr-4 tw-mt-8">
            <img src={profilePicture} alt="Profile" className="tw-w-full tw-h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}