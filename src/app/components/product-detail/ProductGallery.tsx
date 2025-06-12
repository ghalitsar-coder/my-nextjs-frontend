"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "./types";

interface ProductGalleryProps {
  images: ProductImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-2xl overflow-hidden bg-white p-4 shadow-lg mb-5 flex items-center justify-center h-[400px]">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Image */}
      <div className="rounded-2xl overflow-hidden bg-white p-4 shadow-lg mb-5">
        <div className="relative w-full h-[400px]">
          <Image
            src={images[selectedImage].url}
            alt={images[selectedImage].alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-xl transition duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-custom">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(index)}
            className={`w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden ${
              selectedImage === index
                ? "border-2 border-[#9c7c5b]"
                : "border border-gray-200"
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
