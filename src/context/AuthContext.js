import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const createUser = (email, password, username) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Update the user's display name with the provided username
        return updateProfile(user, { displayName: username })
          .then(() => user)
          .catch((error) => {
            throw new Error('Error updating user profile: ' + error.message);
          });
      })
      .catch((error) => {
        throw new Error('Error creating user: ' + error.message);
      });
  };

  const signIn = (email, password) =>  {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
      return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider 
        value={{ createUser, user, logout, signIn }}>
      {children}
    </UserContext.Provider>
  );
};

export function UserAuth() {
  return useContext(UserContext);
};