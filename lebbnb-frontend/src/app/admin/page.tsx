'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { adminApi, publicApi } from '@/lib/api';
import {
  Building2,
  Mail,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: properties } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: () => publicApi.getProperties({ limit: 5 }),
  });

  const { data: contactStats } = useQuery({
    queryKey: ['contact-stats'],
    queryFn: adminApi.getContactStats,
  });

  const { data: contacts } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: () => adminApi.getContacts({ limit: 5 }),
  });

  const stats = [
    {
      label: 'Total Properties',
      value: properties?.pagination.total || 0,
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/properties',
    },
    {
      label: 'New Messages',
      value: contactStats?.new || 0,
      icon: Mail,
      color: 'from-green-500 to-green-600',
      link: '/admin/contacts',
    },
    {
      label: 'Total Contacts',
      value: contactStats?.total || 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/contacts',
    },
    {
      label: 'Gallery Items',
      value: properties?.galleryItems?.length || 0,
      icon: Eye,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/properties',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.link}>
              <div className="card p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Properties</h2>
            <Link
              href="/admin/properties/new"
              className="flex items-center space-x-2 text-[#425b30] hover:text-[#6b8f52] transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Link>
          </div>
          <div className="space-y-4">
            {properties?.galleryItems?.slice(0, 5).map((property) => (
              <Link
                key={property._id}
                href={`/properties/${property._id}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{property.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{property.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{property.images?.length || 0} images</p>
                  <p className="text-xs text-gray-400">{new Date(property.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/admin/properties"
            className="mt-4 flex items-center justify-center space-x-2 text-[#425b30] hover:text-[#6b8f52] transition-colors text-sm font-medium"
          >
            <span>View All Properties</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
            <Link
              href="/admin/contacts"
              className="text-[#425b30] hover:text-[#6b8f52] transition-colors text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {contacts?.contacts?.slice(0, 5).map((contact) => (
              <Link
                key={contact._id}
                href={`/admin/contacts/${contact._id}`}
                className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    contact.status === 'new'
                      ? 'bg-blue-100 text-blue-700'
                      : contact.status === 'read'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {contact.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{contact.subject}</p>
                <p className="text-xs text-gray-400">
                  {new Date(contact.createdAt!).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/admin/contacts"
            className="mt-4 flex items-center justify-center space-x-2 text-[#425b30] hover:text-[#6b8f52] transition-colors text-sm font-medium"
          >
            <span>View All Messages</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/properties/new"
            className="flex items-center justify-center space-x-2 btn-primary"
          >
            <Building2 className="h-5 w-5" />
            <span>Add Property</span>
          </Link>
          <Link
            href="/admin/about"
            className="flex items-center justify-center space-x-2 btn-secondary"
          >
            <Info className="h-5 w-5" />
            <span>Edit About Us</span>
          </Link>
          <Link
            href="/admin/home"
            className="flex items-center justify-center space-x-2 btn-secondary"
          >
            <Building2 className="h-5 w-5" />
            <span>Edit Home Page</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
