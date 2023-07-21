// Import the functions you need from the SDKs you need
/*import { initializeApp } from "firebase/app";*/
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/app';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    
    /*apiKey: "AIzaSyAUVbRgZtGqrt23Ljeu1Cvw8JdRKMOMkF4",
    authDomain: "optionorient.firebaseapp.com",
    projectId: "optionorient",
    storageBucket: "optionorient.appspot.com",
    messagingSenderId: "78120688651",
    appId: "1:78120688651:web:25be164b47c235277e7b0e",
    measurementId: "G-8VXZJRFSD0"*/
    apiKey: "AIzaSyCwCIVgxc8_IAmXl_bg9lfrIyBCR-Qk3LQ",
    authDomain: "test-b6d25.firebaseapp.com",
    projectId: "test-b6d25",
    storageBucket: "test-b6d25.appspot.com",
    messagingSenderId: "616814196338",
    appId: "1:616814196338:web:824eeedc3bec109ce1f4eb"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export { app }; 
export default app;

//hooks 
export function useAuth() {
    const [currUser, setCurrUser] = useState();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => setCurrUser(user));
        return unsub;
    }, [])

    return currUser;
}



