'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, ExternalLink } from 'lucide-react';
import type { Property } from '@/types';
import { useState, useEffect } from 'react';

interface PropertyCarouselProps {
  properties: Property[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  if (!properties || properties.length === 0) {
    return null;
  }

  // Flatten all images with property info
  const carouselItems = properties.flatMap(property =>
    property.images?.map((img, idx) => ({
      url: `${API_URL}/uploads/${img}`,
      propertyId: property._id,
      propertyTitle: property.title,
      propertyAddress: property.address,
      imageIndex: idx,
      totalImages: property.images.length
    }))
  );

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselItems.length, isPaused]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return carouselItems.length - 1;
      if (next >= carouselItems.length) return 0;
      return next;
    });
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <section className="relative py-20 bg-gradient-to-br from-[#2f4222] via-[#425b30] to-[#2f4222] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#6b8f52] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#9dbe85] font-semibold text-sm uppercase tracking-wider mb-2">
            Visual Gallery
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">
            Experience Our Properties
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Explore stunning visuals of our premium property collection
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Carousel */}
          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden bg-black/20 backdrop-blur-sm">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4 }
                }}
                className="absolute inset-0"
              >
                <img
                  src={currentItem.url}
                  alt={currentItem.propertyTitle}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Property Information Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
                  <div className="max-w-4xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="bg-[#6b8f52]/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                          {currentItem.imageIndex + 1} / {currentItem.totalImages}
                        </span>
                        <span className="text-white/70 text-sm">
                          {currentIndex + 1} of {carouselItems.length} images
                        </span>
                      </div>
                      
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 font-[family-name:var(--font-playfair)]">
                        {currentItem.propertyTitle}
                      </h3>
                      
                      <div className="flex items-start text-white/90 mb-6">
                        <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-[#9dbe85]" />
                        <span className="text-base sm:text-lg">{currentItem.propertyAddress}</span>
                      </div>

                      <Link
                        href={`/properties/${currentItem.propertyId}`}
                        className="inline-flex items-center space-x-2 bg-white/95 hover:bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                      >
                        <span>View Full Gallery</span>
                        <ExternalLink className="h-5 w-5" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-xl transition-all hover:scale-110 z-10 group"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => paginate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-xl transition-all hover:scale-110 z-10 group"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="mt-6 relative">
            <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
              {carouselItems.slice(
                Math.max(0, currentIndex - 4),
                Math.min(carouselItems.length, currentIndex + 5)
              ).map((item, idx) => {
                const actualIndex = Math.max(0, currentIndex - 4) + idx;
                return (
                  <motion.button
                    key={actualIndex}
                    onClick={() => {
                      setDirection(actualIndex > currentIndex ? 1 : -1);
                      setCurrentIndex(actualIndex);
                    }}
                    className={`relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden transition-all ${
                      actualIndex === currentIndex
                        ? 'ring-4 ring-[#9dbe85] scale-110'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                    whileHover={{ scale: actualIndex === currentIndex ? 1.1 : 1.05 }}
                  >
                    <img
                      src={item.url}
                      alt={`Thumbnail ${actualIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {actualIndex === currentIndex && (
                      <div className="absolute inset-0 bg-[#6b8f52]/20" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.min(carouselItems.length, 10) }).map((_, idx) => {
              const actualIdx = Math.floor((idx / 10) * carouselItems.length);
              const isActive = Math.floor((currentIndex / carouselItems.length) * 10) === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(actualIdx)}
                  className={`h-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-[#9dbe85] w-8'
                      : 'bg-white/30 w-1.5 hover:bg-white/50'
                  }`}
                  aria-label={`Go to section ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Auto-play indicator */}
        {!isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6"
          >
            <p className="text-white/60 text-sm">
              <span className="inline-block mr-2">⏸️</span>
              Hover to pause auto-play
            </p>
          </motion.div>
        )}
      </div>

      {/* Custom scrollbar hide */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
