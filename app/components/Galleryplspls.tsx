'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Photo from './Photo';
import Filter from './Filter';

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

  useEffect(() => {
    if (galleryRef.current) {
      // Animate all photos into view when the component mounts or filter changes
      const items = galleryRef.current.querySelectorAll('.photo-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }
  }, [filter]);

  const handleFileUpload = (files: FileList) => {
    const uploadedPhotos = Array.from(files).map((file, index) => {
      const imageUrl = URL.createObjectURL(file); // Convert the file to a local URL
      return {
        id: photos.length + index + 1, // Assign a new ID
        src: imageUrl,
        category: 'Uploaded', // Mark as uploaded
      };
    });
    setPhotos([...photos, ...uploadedPhotos]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  
  const categories = [
    'All',
    ...new Set(photos.map(photo => photo.category)), // Get unique categories
  ];

  const filteredPhotos =
    filter === 'All' ? photos : photos.filter(photo => photo.category === filter);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Modern Photo Gallery</h1>

      <Filter
        categories={categories} // Dynamically populated categories
        setFilter={setFilter}
      />

      {/* Drag and Drop Area */}
      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-8 mb-6 flex justify-center items-center flex-col"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()} // Prevent default to allow dropping
      >
        <p className="text-gray-500 text-lg mb-4">
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
          className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Choose Images
        </label>
      </div>

      {/* Gallery Grid */}
      <div
        ref={galleryRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
      >
        {filteredPhotos.map(photo => (
          <Photo key={photo.id} src={photo.src} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
