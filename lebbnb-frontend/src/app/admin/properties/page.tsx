'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { publicApi, adminApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Search,
  MapPin,
  ArrowLeft,
} from 'lucide-react';

export default function AdminPropertiesPage() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-properties', search],
    queryFn: () => publicApi.getProperties({ limit: 100 }),
  });

  const filteredProperties = data?.galleryItems?.filter(p => 
    search === '' || 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast.success('Property deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete property');
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-600 hover:text-[#425b30] transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties Management</h1>
            <p className="text-gray-600">{filteredProperties.length} properties {search ? 'found' : 'total'}</p>
          </div>
          <Link href="/admin/properties/new" className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or address..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
          />
        </div>
      </div>

      {/* Properties List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-[#425b30] animate-spin" />
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="space-y-4">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-6">
                {/* Image */}
                <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={getImageUrl(property.images[0])}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{property.title}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{property.images?.length || 0} images</span>
                      <span className="text-gray-500">Created {new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/properties/${property._id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(property._id, property.title)}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-xl text-gray-600">No properties found</p>
          <Link href="/admin/properties/new" className="mt-4 inline-flex btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Property
          </Link>
        </div>
      )}
    </div>
  );
}
