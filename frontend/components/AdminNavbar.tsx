"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

interface AdminNavbarProps {
  subtitle: string;
  onLogout: () => void;
}

export function AdminNavbar({ subtitle, onLogout }: AdminNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              ⚙️ <span className="hidden sm:inline">Admin Dashboard</span><span className="sm:hidden">Admin</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">{subtitle}</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/admin"
              className={`${
                pathname === "/admin" ? "text-blue-400" : "text-gray-400 hover:text-white"
              } font-semibold transition-colors`}
            >
              Tournaments
            </Link>
            <Link
              href="/admin/carousel"
              className={`${
                pathname === "/admin/carousel" ? "text-blue-400" : "text-gray-400 hover:text-white"
              } font-semibold transition-colors`}
            >
              Carousel
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition-colors text-sm"
            >
              Public Page
            </Link>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 p-4 space-y-4">
          <div className="flex flex-col gap-3">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${
                pathname === "/admin" ? "text-blue-400" : "text-gray-400"
              } font-semibold block`}
            >
              Tournaments
            </Link>
            <Link
              href="/admin/carousel"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${
                pathname === "/admin/carousel" ? "text-blue-400" : "text-gray-400"
              } font-semibold block`}
            >
              Carousel
            </Link>
          </div>
          <div className="h-px bg-gray-700 my-2"></div>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium text-center"
            >
              Public Page
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
