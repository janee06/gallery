import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBV8q0m6gyZn3qGIC3Pqa7U2PiZCLe6A4k",
  authDomain: "photogallery-a82d2.firebaseapp.com",
  projectId: "photogallery-a82d2",
  storageBucket: "photogallery-a82d2.firebasestorage.app",
  messagingSenderId: "796330113885",
  appId: "1:796330113885:web:b7a4e91b00b5c15f9246b4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);