"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "#tournaments", label: "Tournaments" },
    { href: "#features", label: "Features" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 md:pt-6 pointer-events-none flex justify-center">
      <header 
        className="pointer-events-auto w-full max-w-[95%] md:max-w-[90%] lg:max-w-7xl bg-[#170928]/90 backdrop-blur-lg border border-white/10 rounded-full shadow-[0_8px_32px_0_rgba(23,9,40,0.5)] transition-all duration-300"
      >
        <div className="px-5 sm:px-8 py-3 sm:py-4 flex justify-between items-center relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 z-10 group">
            <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Image
                src="/walle-logo.png"
                alt="WallE Arena Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white tracking-wide">WallE Arena</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-purple-200 hover:text-white transition-colors duration-300 text-sm font-medium py-2 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
            
            <Link
              href="/contact"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.23)] text-sm ml-4"
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden z-10 p-2 text-purple-200 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div 
          ref={menuRef}
          className={`absolute top-full left-0 right-0 mt-3 md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
          }`}
        >
          <div className="bg-[#170928]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mx-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-purple-200 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all duration-300 text-base font-medium flex items-center justify-between group"
              >
                {link.label}
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </a>
            ))}
            <div className="h-px w-full bg-white/10 my-2"></div>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3.5 rounded-xl text-center shadow-lg transition-transform active:scale-95"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
