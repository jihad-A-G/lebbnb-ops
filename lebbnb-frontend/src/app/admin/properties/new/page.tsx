'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { compressImages, filterImageFiles, formatFileSize } from '@/lib/imageCompression';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewPropertyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    address: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });
  const [uploadProgress, setUploadProgress] = useState(0);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const property = await adminApi.createProperty(data);
      
      if (images.length > 0) {
        setUploadProgress(0);
        toast.loading('Uploading images...', { id: 'upload' });
        
        try {
          await adminApi.uploadPropertyImages(property._id, images);
          toast.success('Images uploaded successfully!', { id: 'upload' });
        } catch (error) {
          toast.error('Image upload failed', { id: 'upload' });
          throw error;
        }
      }
      return property;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast.success('Property created successfully!');
      router.push('/admin/properties');
    },
    onError: () => {
      toast.error('Failed to create property');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Filter to only image files
      const imageFiles = filterImageFiles(selectedFiles);
      
      if (imageFiles.length === 0) {
        toast.error('Please select valid image files');
        return;
      }

      // Calculate original size
      const originalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);
      const originalSizeMB = (originalSize / 1024 / 1024).toFixed(2);
      
      toast.loading(`Compressing ${imageFiles.length} images (${originalSizeMB} MB)...`, { id: 'compress' });
      setIsCompressing(true);
      setCompressionProgress({ current: 0, total: imageFiles.length });

      try {
        // Compress images in browser before adding to state
        const compressedFiles = await compressImages(
          imageFiles,
          (current, total, percent) => {
            setCompressionProgress({ current, total });
          }
        );

        const compressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0);
        const compressedSizeMB = (compressedSize / 1024 / 1024).toFixed(2);
        const savedPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);

        toast.success(
          `Compressed ${imageFiles.length} images: ${originalSizeMB}MB → ${compressedSizeMB}MB (saved ${savedPercent}%)`,
          { id: 'compress', duration: 4000 }
        );

        // Add compressed images to state
        setImages(prev => [...prev, ...compressedFiles]);
        
        // Create previews
        compressedFiles.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      } catch (error) {
        console.error('Compression error:', error);
        toast.error('Compression failed, using original files', { id: 'compress' });
        
        // Fall back to original files if compression fails
        setImages(prev => [...prev, ...imageFiles]);
        imageFiles.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      } finally {
        setIsCompressing(false);
        setCompressionProgress({ current: 0, total: 0 });
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!formData.address.trim()) {
      toast.error('Please enter an address');
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/properties"
            className="inline-flex items-center text-gray-600 hover:text-[#425b30] transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Luxurious Villa in Downtown"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Main Street, New York, NY 10001"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425b30]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Property Images</h2>
            
            {/* Upload Area */}
            <div className="mb-6">
              <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition-colors ${
                isCompressing 
                  ? 'bg-gray-100 cursor-not-allowed' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isCompressing ? (
                    <>
                      <Loader2 className="h-12 w-12 text-[#425b30] mb-3 animate-spin" />
                      <p className="mb-2 text-sm text-gray-700 font-semibold">
                        Compressing images...
                      </p>
                      <p className="text-xs text-gray-500">
                        {compressionProgress.current} of {compressionProgress.total} processed
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-700 font-semibold">
                        Click to upload images
                      </p>
                      <p className="text-xs text-gray-500">
                        Images will be automatically compressed before upload
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG or WebP (any size)
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={isCompressing}
                />
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Ready to Upload ({imagePreviews.length} {imagePreviews.length === 1 ? 'image' : 'images'})
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800">
                    ✓ Images compressed and ready for fast upload
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Total size: {formatFileSize(images.reduce((sum, img) => sum + img.size, 0))}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-[#425b30] text-white px-2 py-1 rounded text-xs font-semibold">
                          Cover
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        {formatFileSize(images[index]?.size || 0)}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  The first image will be used as the cover photo
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/properties"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending || isCompressing}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating & Uploading...</span>
                </>
              ) : isCompressing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Compressing...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Create Property</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
