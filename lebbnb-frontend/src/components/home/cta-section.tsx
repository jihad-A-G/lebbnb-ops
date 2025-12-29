'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, Search } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-[#6b8f52] opacity-5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#425b30] opacity-5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
              Ready to Find Your
              <span className="text-gradient"> Dream Property?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Browse through our extensive collection of premium properties or get in touch with our team for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/properties" className="btn-primary flex items-center justify-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Browse Properties</span>
              </Link>
              <Link href="/contact" className="btn-secondary flex items-center justify-center space-x-2">
                <span>Contact Us</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Card Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { title: 'Premium', value: 'Quality', icon: Building2 },
              { title: 'Verified', value: 'Properties', icon: Search },
              { title: 'Expert', value: 'Support', icon: Building2 },
              { title: 'Best', value: 'Locations', icon: Search },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="card p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#425b30] to-[#6b8f52] rounded-full mb-4">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
