import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBV8q0m6gyZn3qGIC3Pqa7U2PiZCLe6A4k",
  authDomain: "photogallery-a82d2.firebaseapp.com",
  projectId: "photogallery-a82d2",
  storageBucket: "photogallery-a82d2.firebasestorage.app",
  messagingSenderId: "796330113885",
  appId: "1:796330113885:web:b7a4e91b00b5c15f9246b4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Google Sign-In
const signInWithGoogle = async (): Promise<User | null> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // Return the signed-in user
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
};

// Sign Out
const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export { auth, signInWithGoogle, logOut };