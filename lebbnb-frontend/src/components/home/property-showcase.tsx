'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, Heart, Share2 } from 'lucide-react';
import type { Property } from '@/types';
import { useState } from 'react';

interface PropertyShowcaseProps {
  properties: Property[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function PropertyShowcase({ properties }: PropertyShowcaseProps) {
  const [activeImage, setActiveImage] = useState(0);

  if (!properties || properties.length === 0) {
    return null;
  }

  // Get all images from properties for a dynamic slideshow
  const allImages = properties.flatMap(property =>
    property.images.slice(0, 2).map(img => ({
      url: `${API_URL}/uploads/${img}`,
      propertyId: property._id,
      title: property.title,
      address: property.address
    }))
  ).slice(0, 20);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#425b30] font-semibold text-sm uppercase tracking-wider mb-2">
            Visual Journey
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-playfair)]">
            Every Property Tells A Story
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Immerse yourself in the beauty and elegance of our properties
          </p>
        </motion.div>

        {/* Parallax Image Grid */}
        <div className="grid grid-cols-12 gap-4 mb-12">
          {/* Left Column - Slower animation */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="col-span-12 md:col-span-4 space-y-4"
          >
            {allImages.slice(0, 3).map((image, index) => (
              <Link
                key={index}
                href={`/properties/${image.propertyId}`}
                className="group block relative overflow-hidden rounded-2xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white font-bold text-lg mb-1 line-clamp-1">{image.title}</h4>
                      <p className="text-white/80 text-sm line-clamp-1">{image.address}</p>
                    </div>
                  </div>
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                      <Eye className="h-4 w-4 text-gray-900" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>

          {/* Center Column - Medium animation */}
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-span-12 md:col-span-4 space-y-4 md:mt-12"
          >
            {allImages.slice(3, 6).map((image, index) => (
              <Link
                key={index}
                href={`/properties/${image.propertyId}`}
                className="group block relative overflow-hidden rounded-2xl"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white font-bold text-lg mb-1 line-clamp-1">{image.title}</h4>
                      <p className="text-white/80 text-sm line-clamp-1">{image.address}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>

          {/* Right Column - Faster animation */}
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 md:col-span-4 space-y-4 md:mt-24"
          >
            {allImages.slice(6, 9).map((image, index) => (
              <Link
                key={index}
                href={`/properties/${image.propertyId}`}
                className="group block relative overflow-hidden rounded-2xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white font-bold text-lg mb-1 line-clamp-1">{image.title}</h4>
                      <p className="text-white/80 text-sm line-clamp-1">{image.address}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Floating Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-3xl font-bold text-[#425b30] mb-2 font-[family-name:var(--font-playfair)]">
              {properties.length}+
            </div>
            <p className="text-gray-600 text-sm">Properties</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-3xl font-bold text-[#425b30] mb-2 font-[family-name:var(--font-playfair)]">
              {allImages.length}+
            </div>
            <p className="text-gray-600 text-sm">Gallery Images</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-3xl font-bold text-[#425b30] mb-2 font-[family-name:var(--font-playfair)]">
              100%
            </div>
            <p className="text-gray-600 text-sm">Quality</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-3xl font-bold text-[#425b30] mb-2 font-[family-name:var(--font-playfair)]">
              24/7
            </div>
            <p className="text-gray-600 text-sm">Support</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
