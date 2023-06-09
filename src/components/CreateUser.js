import './firebase'; // Import the Firebase initialization code
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const db = firebase.firestore();

const createUser = async (userData) => {
  try {
    const docRef = await db.collection('users').add(userData);
    console.log('User document created with ID:', docRef.id);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
};
