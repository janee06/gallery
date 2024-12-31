'use client';

import React from 'react';
import Gallery from "./components/Galleryplspls";

export default function Home() {
  return (
    <main>
      <h1>Photo Gallery</h1>
      <Gallery />
      <style jsx>{`
        h1 {
          text-align: center;
          margin: 20px 0;
        }
      `}</style>
    </main>
  );
}