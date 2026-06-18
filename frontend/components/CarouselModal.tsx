'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { useCreateCarouselSlide, useUpdateCarouselSlide } from '@/lib/hooks';
import { CarouselSlide, carouselAPI } from '@/lib/api';

interface CarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide?: CarouselSlide;
}

export function CarouselModal({ isOpen, onClose, slide }: CarouselModalProps) {
  const isEditing = !!slide;
  
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePosition, setImagePosition] = useState('center');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const createMutation = useCreateCarouselSlide();
  const updateMutation = useUpdateCarouselSlide();

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (slide) {
      setHeadline(slide.headline);
      setDescription(slide.description);
      setImageUrl(slide.imageUrl);
      setImagePosition(slide.imagePosition || 'center');
      setIsActive(slide.isActive);
      setOrder(slide.order);
    } else {
      setHeadline('');
      setDescription('');
      setImageUrl('');
      setImagePosition('center');
      setIsActive(true);
      setOrder(0);
    }
    setUploadError('');
  }, [slide, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError('');
      const response = await carouselAPI.uploadImage(file);
      setImageUrl(response.url);
    } catch (error) {
      setUploadError('Failed to upload image. Please try again.');
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      setUploadError('An image is required.');
      return;
    }

    const payload = {
      headline,
      description,
      imageUrl,
      imagePosition,
      isActive,
      order,
    };

    if (isEditing && slide) {
      updateMutation.mutate(
        { id: slide.id, data: payload },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header (Fixed) */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 flex-shrink-0 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Slide' : 'Add New Slide'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            <div className="grid grid-cols-1 gap-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Banner Image *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-gray-500 transition-colors">
                <div className="space-y-1 text-center">
                  {imageUrl ? (
                    <div className="relative w-full h-48 mb-4">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-400 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-gray-900 rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading || isPending}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              {isUploading && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-400">
                  <Loader className="w-4 h-4 animate-spin" /> Uploading image...
                </div>
              )}
              {uploadError && (
                <p className="mt-2 text-sm text-red-500">{uploadError}</p>
              )}
            </div>

            {/* Headline */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Headline * (Max 120 chars)
              </label>
              <input
                type="text"
                required
                maxLength={120}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter headline"
                disabled={isPending}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description * (Max 300 chars)
              </label>
              <textarea
                required
                maxLength={300}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Enter description"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={isPending}
                />
              </div>

              {/* Image Position */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image Position
                </label>
                <select
                  value={imagePosition}
                  onChange={(e) => setImagePosition(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={isPending}
                >
                  <option value="center">Center</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <div className="flex items-center h-[42px]">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      disabled={isPending}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Footer (Fixed) */}
          <div className="px-6 py-4 border-t border-gray-800 bg-gray-900 flex justify-end gap-3 flex-shrink-0 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isUploading || !imageUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isPending && <Loader className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
