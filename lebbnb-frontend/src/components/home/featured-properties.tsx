'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Property } from '@/types';

interface FeaturedPropertiesProps {
  properties: Property[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  if (!properties || properties.length === 0) {
    return null;
  }

  // Collect all images from all properties for a dynamic gallery
  const allImages = properties.flatMap(property => 
    property.images.map(img => ({
      url: `${API_URL}/uploads/${img}`,
      propertyId: property._id,
      propertyTitle: property.title,
      propertyAddress: property.address
    }))
  );

  const imageShowcase = allImages.slice(0, 12);

  return (
    <div className="bg-white">
      {/* Image Showcase Banner - Horizontal Scrolling Gallery */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex space-x-4"
          >
            {[...imageShowcase, ...imageShowcase].map((image, index) => (
              <Link 
                key={index}
                href={`/properties/${image.propertyId}`}
                className="relative flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden group"
              >
                <img
                  src={image.url}
                  alt={image.propertyTitle}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-semibold line-clamp-1">{image.propertyTitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
