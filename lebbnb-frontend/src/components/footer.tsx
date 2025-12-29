'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/logo-lebbnb.png" 
                alt="Lebbnb Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
              <span className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
                Lebbnb
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner in finding the perfect rental property. Quality living spaces for quality lives.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#6b8f52] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6b8f52] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6b8f52] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6b8f52] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#6b8f52] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-[#6b8f52] transition-colors text-sm">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#6b8f52] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#6b8f52] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?type=apartment" className="text-gray-400 hover:text-[#6b8f52] transition-colors text-sm">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=house" className="text-gray-400 hover:text-[#6b8f52] transition-colors text-sm">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=villa" className="text-gray-400 hover:text-[#6b8f52] transition-colors text-sm">
                  Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=condo" className="text-gray-400 hover:text-[#6b8f52] transition-colors text-sm">
                  Condos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin className="h-5 w-5 text-[#6b8f52] flex-shrink-0 mt-0.5" />
                <span>123 Property Street, Real Estate City, RC 12345</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="h-5 w-5 text-[#6b8f52] flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="h-5 w-5 text-[#6b8f52] flex-shrink-0" />
                <span>info@lebbnb.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Lebbnb. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
