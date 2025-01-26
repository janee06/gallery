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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const initialPhotos = [
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
  const [photos, setPhotos] = useState(initialPhotos);
  const [filter, setFilter] = useState('All');
  const galleryRef = useRef<HTMLDivElement>(null);

  // Auth State Hook
  const [user, loading, error] = useAuthState(auth);

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

  const uploadFileToFirebase = async (file: File) => {
    const fileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `photos/${fileName}`);
    try {
      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Add the photo to the gallery
      setPhotos((prevPhotos) => [
        ...prevPhotos,
        { id: prevPhotos.length + 1, src: downloadURL, category: 'Uploaded' },
      ]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(uploadFileToFirebase);
    await Promise.all(uploadPromises); // Wait for all uploads to complete
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
          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative">
      {/* Top Right User Info */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <p className="text-gray-800">Welcome, {user.displayName}</p>
        <button
          onClick={handleSignOut}
          className="bg-red-500 px-3 py-2 rounded text-white hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
  
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-8 text-black">Photo Gallery</h1>
  
      {/* Filter Section */}
      <Filter categories={categories} setFilter={setFilter} />
  
      {/* Drag and Drop Area */}
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
  
      {/* Gallery Grid */}
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