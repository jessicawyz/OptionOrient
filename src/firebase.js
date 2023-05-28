// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0--_Tzmvr7TWvp2rDUD3fWq7Y_apkub8",
    authDomain: "test-a55eb.firebaseapp.com",
    projectId: "test-a55eb",
    storageBucket: "test-a55eb.appspot.com",
    messagingSenderId: "597392984567",
    appId: "1:597392984567:web:170483eca04e94611d06f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app


