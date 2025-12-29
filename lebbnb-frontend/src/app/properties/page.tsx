'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { publicApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { Loader2, MapPin, Search, X, Image as ImageIcon } from 'lucide-react';

export default function PropertiesPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['properties', page],
    queryFn: () => publicApi.getProperties({ page, limit: 20 }),
  });

  const filteredProperties = data?.galleryItems.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2f4222] via-[#425b30] to-[#557141] py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white font-[family-name:var(--font-playfair)] px-4">
              Our Gallery
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Explore our stunning collection of properties
            </p>
            <p className="text-base sm:text-lg text-gray-200">
              {data?.pagination.total || 0} beautiful properties
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or location..."
                className="w-full pl-11 sm:pl-14 pr-10 sm:pr-12 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#425b30] focus:border-transparent transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-[#425b30] animate-spin" />
          </div>
        ) : filteredProperties && filteredProperties.length > 0 ? (
          <>
            {/* Masonry Grid - Airbnb Style */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="break-inside-avoid"
                >
                  <Link href={`/properties/${property._id}`}>
                    <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                      {/* Image */}
                      <div className="relative overflow-hidden aspect-[4/3]">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={getImageUrl(property.images[0])}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <ImageIcon className="h-16 w-16 text-gray-300" />
                          </div>
                        )}
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Image count badge */}
                        {property.images && property.images.length > 1 && (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 flex items-center space-x-1">
                            <ImageIcon className="h-4 w-4" />
                            <span>{property.images.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#425b30] transition-colors line-clamp-2">
                          {property.title}
                        </h3>
                        <div className="flex items-start text-gray-600">
                          <MapPin className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0 text-[#425b30]" />
                          <span className="text-sm line-clamp-2">{property.address}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-16 gap-2"
              >
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-medium hover:border-[#425b30] hover:text-[#425b30] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-12 h-12 rounded-xl font-medium transition-all ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-[#425b30] to-[#557141] text-white shadow-lg'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#425b30] hover:text-[#425b30]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                  disabled={page === data.pagination.pages}
                  className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-medium hover:border-[#425b30] hover:text-[#425b30] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ImageIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              {searchQuery ? 'No properties match your search' : 'No properties available'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 btn-primary"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
