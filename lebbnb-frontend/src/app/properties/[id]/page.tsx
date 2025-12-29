'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { publicApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { 
  Loader2, 
  MapPin, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useState } from 'react';
import { use } from 'react';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', resolvedParams.id],
    queryFn: () => publicApi.getProperty(resolvedParams.id),
  });

  const nextImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-12 w-12 text-[#425b30] animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <Link href="/properties" className="btn-primary">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-20 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button */}
          <Link 
            href="/properties"
            className="inline-flex items-center text-gray-600 hover:text-[#425b30] transition-colors mb-6 sm:mb-8 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Gallery
          </Link>

          {/* Title and Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 font-[family-name:var(--font-playfair)]">
              {property.title}
            </h1>
            <div className="flex items-start text-gray-600 text-base sm:text-lg">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#425b30] mt-0.5 flex-shrink-0" />
              <span>{property.address}</span>
            </div>
          </motion.div>

          {/* Images Grid - Airbnb Style */}
          {property.images && property.images.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8 sm:mb-12"
            >
              {property.images.length === 1 ? (
                // Single Image
                <button
                  onClick={() => {
                    setCurrentImageIndex(0);
                    setLightboxOpen(true);
                  }}
                  className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden group cursor-zoom-in"
                >
                  <img
                    src={getImageUrl(property.images[0])}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </button>
              ) : property.images.length === 2 ? (
                // Two Images
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-auto sm:h-[400px] md:h-[500px] lg:h-[600px]">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setLightboxOpen(true);
                      }}
                      className="relative h-[250px] sm:h-full rounded-xl sm:rounded-2xl overflow-hidden group cursor-zoom-in"
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                // 3+ Images - Airbnb Style Grid
                <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-3 sm:gap-4 h-auto sm:h-[400px] md:h-[500px] lg:h-[600px]">
                  {/* Large Left Image */}
                  <button
                    onClick={() => {
                      setCurrentImageIndex(0);
                      setLightboxOpen(true);
                    }}
                    className="sm:col-span-2 sm:row-span-2 rounded-xl sm:rounded-l-2xl overflow-hidden group cursor-zoom-in relative h-[250px] sm:h-full"
                  >
                    <img
                      src={getImageUrl(property.images[0])}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </button>

                  {/* Top Right Images */}
                  {property.images.slice(1, 3).map((image, index) => (
                    <button
                      key={index + 1}
                      onClick={() => {
                        setCurrentImageIndex(index + 1);
                        setLightboxOpen(true);
                      }}
                      className={`overflow-hidden group cursor-zoom-in relative ${
                        index === 1 ? 'rounded-tr-2xl' : ''
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${property.title} - ${index + 2}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </button>
                  ))}

                  {/* Bottom Right Images */}
                  {property.images.slice(3, 5).map((image, index) => (
                    <button
                      key={index + 3}
                      onClick={() => {
                        setCurrentImageIndex(index + 3);
                        setLightboxOpen(true);
                      }}
                      className={`overflow-hidden group cursor-zoom-in relative ${
                        index === 1 ? 'rounded-br-2xl' : ''
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${property.title} - ${index + 4}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Show All Photos button on last visible image */}
                      {index === 1 && property.images.length > 5 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="bg-white px-6 py-3 rounded-lg font-semibold text-gray-900 flex items-center space-x-2">
                            <ImageIcon className="h-5 w-5" />
                            <span>+{property.images.length - 5} more</span>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Show All Photos Button */}
              {property.images.length > 1 && (
                <button
                  onClick={() => {
                    setCurrentImageIndex(0);
                    setLightboxOpen(true);
                  }}
                  className="mt-6 flex items-center space-x-2 text-gray-700 hover:text-[#425b30] transition-colors font-medium"
                >
                  <ImageIcon className="h-5 w-5" />
                  <span>View all {property.images.length} photos</span>
                </button>
              )}
            </motion.div>
          ) : (
            <div className="h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-12">
              <div className="text-center">
                <ImageIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No images available</p>
              </div>
            </div>
          )}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="card p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Interested in this property?</h2>
                <p className="text-gray-600 text-lg">Get in touch with us for more information</p>
              </div>
              
              <Link href="/contact" className="btn-primary w-full max-w-md mx-auto block text-center text-lg py-4">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && property.images && property.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 bg-black/50 p-3 rounded-full backdrop-blur-sm"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white hover:text-gray-300 z-50 bg-black/50 p-3 rounded-full backdrop-blur-sm"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white hover:text-gray-300 z-50 bg-black/50 p-3 rounded-full backdrop-blur-sm"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={getImageUrl(property.images[currentImageIndex])}
              alt={`${property.title} - ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full backdrop-blur-sm">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </motion.div>
      )}
    </>
  );
}
