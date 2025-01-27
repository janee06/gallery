'use client';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Photo from './Photo';
import Filter from './Filter';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBV8q0m6gyZn3qGIC3Pqa7U2PiZCLe6A4k",
  authDomain: "photogallery-a82d2.firebaseapp.com",
  projectId: "photogallery-a82d2",
  storageBucket: "photogallery-a82d2.firebasestorage.app",
  messagingSenderId: "796330113885",
  appId: "1:796330113885:web:b7a4e91b00b5c15f9246b4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const LOCAL_STORAGE_KEY = 'photoGallery';

interface Photo {
  id: number;
  src: string; // Ensure src is always a string
  category: string;
}

const initialPhotos: Photo[] = [
  { id: 1, src: '/Lights_bockova.jpg', category: '3D Graphics' },
  { id: 2, src: '/lowpolybuilding_Bockova.jpg', category: '3D Graphics' },
  { id: 3, src: '/sandcastle.png', category: '3D Graphics' },
  { id: 4, src: '/book.jpg', category: '3D Graphics' },
  { id: 17, src: '/postapocalypticpack_Bockova.jpg', category: '3D Graphics' },
  { id: 5, src: '/Bockova_auto.jpg', category: '2D Graphics' },
  { id: 6, src: '/Bockova_carbanner.jpg', category: '2D Graphics' },
  { id: 7, src: '/Bockova_koncert.jpg', category: '2D Graphics' },
  { id: 8, src: '/Bočková_movie.jpg', category: '2D Graphics' },
  { id: 9, src: '/Bockova_neonline.jpg', category: '2D Graphics' },
  { id: 10, src: '/energydrink.jpg', category: '2D Graphics' },
  { id: 11, src: '/Free_Vinyl_Mockup_1.jpg', category: '2D Graphics' },
  { id: 12, src: '/logo_Bockova.png', category: '2D Graphics' },
  { id: 13, src: '/photomanipulation_bockova.jpg', category: '2D Graphics' },
  { id: 14, src: '/tshirt.jpg', category: '2D Graphics' },
  { id: 15, src: '/Bočková_web1.jpg', category: 'Web design' },
  { id: 16, src: '/shoes.jpg', category: 'Web design' },
];

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const savedPhotos = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedPhotos ? JSON.parse(savedPhotos) : initialPhotos;
  });
  const [filter, setFilter] = useState('All');
  const galleryRef = useRef<HTMLDivElement>(null);

  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll('.photo-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }
  }, [filter]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  // New handleFileUpload function
  const handleFileUpload = async (files: FileList) => {
    const fileReaders = Array.from(files).map((file) => {
      return new Promise<Photo>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Ensure reader.result is a string
          if (typeof reader.result === 'string') {
            resolve({ id: Date.now(), src: reader.result, category: 'Uploaded' });
          } else {
            reject(new Error('Invalid file type: reader.result is not a string'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // Convert the file to Base64 string
      });
    });

    try {
      const newPhotos = await Promise.all(fileReaders);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    } catch (error) {
      console.error('Error reading files:', error);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFileUpload(files);
  };

  const categories = ['All', ...new Set(photos.map((photo) => photo.category))];

  const filteredPhotos =
    filter === 'All' ? photos : photos.filter((photo) => photo.category === filter);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-center mb-4 text-black">Sign In Required</h1>
        <p className="mb-6 text-gray-600">Please sign in to access the gallery.</p>
        <button
          onClick={handleSignIn}
          className="bg-violet-500 px-4 py-2 rounded text-white hover:bg-violet-700"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative">
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <p className="text-gray-800">Welcome, {user.displayName}</p>
        <button
          onClick={handleSignOut}
          className="bg-red-500 px-3 py-2 rounded text-white hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 text-black">Photo Gallery</h1>

      <Filter categories={categories} setFilter={setFilter} />

      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-8 mb-6 flex justify-center items-center flex-col"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="text-gray-700 text-lg mb-4">
          Drag and drop images here, or click to upload.
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          id="fileInput"
          onChange={handleBrowse}
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-violet-400 text-white py-2 px-4 rounded-lg hover:bg-violet-600 transition"
        >
          Choose Images
        </label>
      </div>

      <div
        ref={galleryRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
      >
        {filteredPhotos.map((photo) => (
          <Photo key={photo.id} src={photo.src} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;