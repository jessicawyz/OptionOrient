// Import the functions you need from the SDKs you need
/*import { initializeApp } from "firebase/app";*/
import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    /*apiKey: "AIzaSyD0--_Tzmvr7TWvp2rDUD3fWq7Y_apkub8",
    authDomain: "test-a55eb.firebaseapp.com",
    projectId: "test-a55eb",
    storageBucket: "test-a55eb.appspot.com",
    messagingSenderId: "597392984567",
    appId: "1:597392984567:web:170483eca04e94611d06f2"*/
    apiKey: "AIzaSyAUVbRgZtGqrt23Ljeu1Cvw8JdRKMOMkF4",
    authDomain: "optionorient.firebaseapp.com",
    projectId: "optionorient",
    storageBucket: "optionorient.appspot.com",
    messagingSenderId: "78120688651",
    appId: "1:78120688651:web:25be164b47c235277e7b0e",
    measurementId: "G-8VXZJRFSD0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app


