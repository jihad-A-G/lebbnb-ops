'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { publicApi, adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Loader2,
  Save,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Star,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function AdminHomePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'testimonials'>('hero');

  const { data: homeData, isLoading } = useQuery({
    queryKey: ['home'],
    queryFn: publicApi.getHome,
  });

  const updateMutation = useMutation({
    mutationFn: adminApi.updateHome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home'] });
      toast.success('Home page updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update home page');
    },
  });

  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    stats: [] as Array<{ label: string; value: string }>,
    testimonials: [] as Array<{ name: string; text: string; rating: number }>,
  });

  // Update form data when homeData loads
  useEffect(() => {
    if (homeData) {
      console.log('Loading home data:', homeData); // Debug log
      setFormData({
        heroTitle: homeData.heroTitle || '',
        heroSubtitle: homeData.heroSubtitle || '',
        heroDescription: homeData.heroDescription || '',
        stats: (homeData.stats || []).map(s => ({
          label: s.label || '',
          value: s.value || ''
        })),
        testimonials: (homeData.testimonials || []).map(t => ({
          name: t.name || '',
          text: t.text || '',
          rating: t.rating ?? 5
        })),
      });
    }
  }, [homeData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { label: '', value: '' }],
    });
  };

  const removeStat = (index: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index),
    });
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...formData.stats];
    newStats[index][field] = value;
    setFormData({ ...formData, stats: newStats });
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, { name: '', text: '', rating: 5 }],
    });
  };

  const removeTestimonial = (index: number) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((_, i) => i !== index),
    });
  };

  const updateTestimonial = (
    index: number, 
    field: keyof typeof formData.testimonials[0], 
    value: string | number
  ) => {
    const newTestimonials = [...formData.testimonials];
    if (field === 'rating') {
      newTestimonials[index][field] = value as number;
    } else {
      newTestimonials[index][field] = value as string;
    }
    setFormData({ ...formData, testimonials: newTestimonials });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 text-[#425b30] animate-spin" />
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Page Editor</h1>
        <p className="text-gray-600">Customize your home page content</p>
      </div>

      {/* Tabs */}
      <div className="card mb-6 p-0">
        <div className="flex space-x-1 border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'hero'
                ? 'text-[#425b30] border-b-2 border-[#425b30]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hero Section
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'stats'
                ? 'text-[#425b30] border-b-2 border-[#425b30]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'testimonials'
                ? 'text-[#425b30] border-b-2 border-[#425b30]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Testimonials
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Hero Section Content</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Title *
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    placeholder="e.g., Discover Your Future"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    placeholder="e.g., REAL ESTATE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Description
                  </label>
                  <textarea
                    value={formData.heroDescription}
                    onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                    placeholder="e.g., Explore our exclusive collection of premium rental properties..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Statistics</h2>
                <button
                  type="button"
                  onClick={addStat}
                  className="flex items-center space-x-2 text-[#425b30] hover:text-[#557141] font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Stat</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.stats.map((stat, index) => (
                  <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-[#425b30] mt-3" />
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        placeholder="Label (e.g., Properties)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
                      />
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        placeholder="Value (e.g., 500+)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                {formData.stats.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No statistics added yet. Click "Add Stat" to create one.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
                <button
                  type="button"
                  onClick={addTestimonial}
                  className="flex items-center space-x-2 text-[#425b30] hover:text-[#557141] font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.testimonials.map((testimonial, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                        placeholder="Customer Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
                      />
                      <textarea
                        value={testimonial.text}
                        onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                        placeholder="Testimonial text..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating: {testimonial.rating}/5
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={testimonial.rating}
                          onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {formData.testimonials.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No testimonials added yet. Click "Add Testimonial" to create one.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn-primary flex items-center space-x-2 px-8 py-3"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
