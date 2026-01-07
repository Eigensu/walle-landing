'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-walle-dark border-t border-walle-purple/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/walle-logo.png" 
                alt="WallE Arena Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-white">WallE Arena</span>
            </div>
            <p className="text-purple-300 text-sm leading-relaxed">
              Your premier destination for fantasy gaming tournaments. 
              Experience competitive gaming like never before.
            </p>
            <p className="text-purple-400 text-xs mt-3">
              Developed by Eigensu Business Solutions
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-purple-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-purple-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-purple-300 hover:text-white transition-colors text-sm">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-purple-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-purple-300 hover:text-white transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-purple-300">
              <li>
                <span className="block">Email:</span>
                <a href="mailto:support@wallearena.com" className="hover:text-white transition-colors">
                  support@wallearena.com
                </a>
              </li>
              <li>
                <span className="block mt-2">Support Hours:</span>
                <span>Mon - Fri: 9AM - 6PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-walle-purple/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-purple-400 text-sm">
              © {currentYear} WallE Arena. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-purple-400 hover:text-white transition-colors text-sm">
                Privacy
              </Link>
              <Link href="/terms-and-conditions" className="text-purple-400 hover:text-white transition-colors text-sm">
                Terms
              </Link>
              <Link href="/contact" className="text-purple-400 hover:text-white transition-colors text-sm">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
