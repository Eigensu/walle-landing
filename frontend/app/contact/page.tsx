'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Globe, Twitter, Github, Linkedin } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-walle-darker">
      {/* Header */}
      <header className="bg-walle-dark/80 backdrop-blur-md border-b border-walle-purple/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/walle-logo.png" 
              alt="WALL-E Arena Logo" 
              width={48} 
              height={48}
              className="object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">
                WALL-E ARENA
              </h1>
              <p className="text-purple-300 text-sm">
                Tournaments
              </p>
            </div>
          </Link>
          <Link 
            href="/contact"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2.5 rounded-walle transition-all duration-300 hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Touch</span>
          </h1>
          <p className="text-purple-300 text-xl max-w-2xl mx-auto">
            Have questions about our tournaments? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Email Card */}
          <div className="purple-gradient rounded-walle-lg p-8 border border-walle-purple/30 text-center hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
            <p className="text-purple-300 mb-4">Send us an email anytime</p>
            <a 
              href="mailto:walleevents@gmail.com" 
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              walleevents@gmail.com
            </a>
          </div>

          {/* Location Card */}
          <div className="purple-gradient rounded-walle-lg p-8 border border-walle-purple/30 text-center hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
            <p className="text-purple-300 mb-4">Our office location</p>
            <p className="text-purple-400">
              Mumbai, Maharashtra<br />
              India
            </p>
          </div>

          {/* Phone Card */}
          <div className="purple-gradient rounded-walle-lg p-8 border border-walle-purple/30 text-center hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
            <p className="text-purple-300 mb-4">Reach us by phone</p>
            <a 
              href="tel:+919137055633" 
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              +91 91370 55633
            </a>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-walle-dark/60 backdrop-blur-md rounded-walle-lg p-12 border border-walle-purple/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Follow Us</h2>
            <p className="text-purple-300 text-lg">
              Stay updated with the latest tournaments and gaming news
            </p>
          </div>
          
          <div className="flex justify-center gap-6">
            <a 
              href="https://twitter.com/wallearena" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500/20 hover:bg-purple-500/30 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Twitter className="w-8 h-8 text-purple-400" />
            </a>
            <a 
              href="https://github.com/wallearena" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500/20 hover:bg-purple-500/30 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Github className="w-8 h-8 text-purple-400" />
            </a>
            <a 
              href="https://linkedin.com/company/wallearena" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500/20 hover:bg-purple-500/30 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Linkedin className="w-8 h-8 text-purple-400" />
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-walle transition-all duration-300 hover:scale-105"
          >
            Back to Tournaments
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-purple-300">
            <p>&copy; 2026 WALL-E Arena. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
