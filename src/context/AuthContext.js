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

  const createUser = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Update the user's display name with the provided username
      await updateProfile(user, { displayName: username });
      setUser(user);
      return user;
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);
      return user;
    } catch (error) {
      throw new Error('Error signing in: ' + error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser({});
    } catch (error) {
      throw new Error('Error logging out: ' + error.message);
    }
  };

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
      value={{
        createUser,
        signIn,
        logout,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function UserAuth() {
  return useContext(UserContext);
}
