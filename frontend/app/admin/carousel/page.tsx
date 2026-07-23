'use client';

import React, { useState, useEffect } from 'react';
import { Gatekeeper } from '@/components/Gatekeeper';
import { ClientOnly } from '@/components/ClientOnly';
import { useAllCarousel, useDeleteCarouselSlide, useToggleCarouselSlide } from '@/lib/hooks';
import { CarouselSlide } from '@/lib/api';
import { CarouselModal } from '@/components/CarouselModal';
import { Plus, Edit2, Trash2, Loader, AlertCircle, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/AdminNavbar';

export default function AdminCarouselPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | undefined>();

  const { data: slides, isLoading, error } = useAllCarousel();
  const deleteMutation = useDeleteCarouselSlide();
  const toggleMutation = useToggleCarouselSlide();

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAddSlide = () => {
    setEditingSlide(undefined);
    setIsModalOpen(true);
  };

  const handleEditSlide = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      {!isAuthenticated ? (
        <Gatekeeper onAuthenticated={() => setIsAuthenticated(true)} />
      ) : (
        <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          {/* Header */}
          <AdminNavbar subtitle="Manage hero carousel" onLogout={handleLogout} />

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Add Button */}
            <div className="mb-8">
              <button
                onClick={handleAddSlide}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Slide
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                  <p className="text-gray-400">Loading slides...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Failed to Load Carousel Slides
                  </h3>
                  <p className="text-red-200">
                    Make sure the backend is running.
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {slides && slides.length === 0 && (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-lg mb-4">No carousel slides yet</p>
                <button
                  onClick={handleAddSlide}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Slide
                </button>
              </div>
            )}

            {/* Table */}
            {slides && slides.length > 0 && (
              <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-900 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        Headline
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {slides.map((slide, idx) => (
                      <tr 
                        key={slide.id} 
                        className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                      >
                        <td className="px-6 py-3">
                          {slide.imageUrl ? (
                            <img src={slide.imageUrl} alt={slide.headline} className="w-20 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-20 h-12 bg-gray-700 rounded flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-white">
                          {slide.headline}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-400">
                          {slide.order}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <button
                            onClick={() => handleToggleActive(slide.id)}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              slide.isActive
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-600 hover:bg-gray-500 text-white'
                            } transition-colors`}
                          >
                            {slide.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-3 text-sm space-x-2">
                          <button
                            onClick={() => handleEditSlide(slide)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal */}
          <CarouselModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingSlide(undefined);
            }}
            slide={editingSlide}
          />
        </main>
      )}
    </ClientOnly>
  );
}
