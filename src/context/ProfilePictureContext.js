import React, { createContext, useState } from 'react';

const ProfilePictureContext = createContext();

export const ProfilePictureProvider = ({ children }) => {
    const [profilePicture, setProfilePicture] = useState('');
  
    const updateProfilePicture = async (file) => {
      const formData = new FormData();
      formData.append('profilePicture', file);
  
      try {
        const response = await fetch('/uploadProfilePicture', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
  
        if (response.ok) {
          setProfilePicture(data.downloadURL);
        } else {
          console.log('Error uploading profile picture:', data.error);
        }
      } catch (error) {
        console.log('Error uploading profile picture:', error);
      }
    };
  
    return (
      <ProfilePictureContext.Provider value={{ profilePicture, setProfilePicture, updateProfilePicture }}>
        {children}
      </ProfilePictureContext.Provider>
    );
  };

  export { ProfilePictureContext };