'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, Target, Eye, Award, Users } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function AboutPage() {
  const { data: about, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: publicApi.getAbout,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-12 w-12 text-[#425b30] animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2f4222] to-[#425b30] py-16 sm:py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 font-[family-name:var(--font-playfair)] px-4">
              {about?.title || 'About Us'}
            </h1>
            {about?.subtitle && (
              <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto px-4">
                {about.subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16 sm:mb-20"
        >
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed text-center px-4">
            {about?.description || 'We are dedicated to helping you find the perfect property for your needs.'}
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {about?.mission && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#425b30] to-[#6b8f52] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{about.mission}</p>
            </motion.div>
          )}

          {about?.vision && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#425b30] to-[#6b8f52] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{about.vision}</p>
            </motion.div>
          )}
        </div>

        {/* Values */}
        {about?.values && about.values.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 sm:mb-20"
          >
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-[family-name:var(--font-playfair)] px-4">
                Our Values
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 px-4">Principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {about.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#425b30] to-[#6b8f52] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Company Stats */}
        {about?.companyStats && about.companyStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#2f4222] to-[#425b30] rounded-2xl p-8 sm:p-10 md:p-12 mb-16 sm:mb-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {about.companyStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">
                    {stat.value}
                  </p>
                  <p className="text-sm sm:text-base text-gray-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Team Members */}
        {about?.teamMembers && about.teamMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-[family-name:var(--font-playfair)] px-4">
                Meet Our Team
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 px-4">The people behind our success</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {about.teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center"
                >
                  {member.image ? (
                    <img
                      src={`${API_URL}/${member.image}`}
                      alt={member.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#425b30] to-[#6b8f52] flex items-center justify-center mx-auto mb-4">
                      <Users className="h-16 w-16 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-[#425b30] font-medium mb-3">{member.position}</p>
                  {member.bio && (
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
