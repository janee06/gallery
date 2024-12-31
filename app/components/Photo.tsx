'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const Photo = ({ src }: { src: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      // Animate the modal opening
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [isModalOpen]);

  const closeModal = () => {
    if (modalRef.current) {
      // Animate the modal closing
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => setIsModalOpen(false),
      });
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* Thumbnail Photo */}
      <div
        className="photo-item group relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={src}
          alt="Gallery item"
          className="w-full h-60 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
          <p className="text-white text-lg font-semibold">View Image</p>
        </div>
      </div>

      {/* Modal for Fullscreen Image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal} // Close modal on clicking outside the image
        >
          <div
            ref={modalRef}
            className="max-w-3xl max-h-screen object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking on the image
          >
            <img
              src={src}
              alt="Fullscreen Image"
              className="w-full h-auto max-h-screen rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Photo;