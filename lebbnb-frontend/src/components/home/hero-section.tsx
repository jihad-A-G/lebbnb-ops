'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowRight, Play } from 'lucide-react';
import type { Home } from '@/types';
import { useState } from 'react';

interface HeroSectionProps {
  data?: Home;
}

export function HeroSection({ data }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/properties`;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Loading placeholder */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#2f4222] to-black animate-pulse" />
        )}
        
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/video-poster.jpg"
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity' }}
        >
          <source src="/hero-video-optimized.mp4" type="video/mp4" />
          <source src="/WhatsApp Video 2025-12-14 at 10.02.45 PM.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-[#2f4222]/80" />
        
        {/* Animated gradient overlay */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-tr from-[#425b30]/30 via-transparent to-[#6b8f52]/30"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-4 sm:mb-6"
            >
              <div className="inline-flex items-center space-x-2 bg-[#6b8f52]/20 backdrop-blur-md border border-[#6b8f52]/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                <Play className="h-4 w-4 text-[#9dbe85]" fill="currentColor" />
                <span className="text-[#9dbe85] font-semibold text-xs sm:text-sm uppercase tracking-wider">
                  {data?.heroSubtitle || 'Premium Real Estate'}
                </span>
              </div>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight font-[family-name:var(--font-playfair)]">
              {data?.heroTitle || 'Discover Your Future:'}
              <br />
              <span className="bg-gradient-to-r from-[#9dbe85] via-[#6b8f52] to-[#9dbe85] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Find The Perfect Property
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl px-4 text-gray-200 max-w-3xl mx-auto drop-shadow-lg">
              {data?.heroDescription || 'Explore our exclusive collection of premium rental properties. Your dream home awaits.'}
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 sm:mt-12 max-w-3xl mx-auto px-4"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/50">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search properties by title or location..."
                      className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b8f52] focus:border-[#6b8f52] text-gray-900 text-base sm:text-lg shadow-lg transition-all"
                    />
                  </div>
                </div>

                <Link
                  href="/properties"
                  className="mt-4 w-full btn-primary flex items-center justify-center space-x-2 py-3 sm:py-4 text-base sm:text-lg"
                >
                  <span>Explore Our Gallery</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/80 text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
