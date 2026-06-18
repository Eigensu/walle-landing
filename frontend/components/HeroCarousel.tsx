'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useActiveCarousel } from '@/lib/hooks';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

export function HeroCarousel() {
  const { data: slides, isLoading, error } = useActiveCarousel();

  if (isLoading) {
    return (
      <div className="w-full h-[45vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-walle-darker">
        <Loader className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || !slides || slides.length === 0) {
    return (
      <div className="w-full h-[45vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-walle-darker relative overflow-hidden border-b border-purple-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="text-center z-10 p-6">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-500 mb-4">
            Welcome to WallE Arena
          </h1>
          <p className="text-gray-400 text-lg">
            New tournaments and events coming soon. Stay tuned!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[85vh] md:h-[65vh] lg:h-[75vh] xl:h-[80vh] min-h-[600px] group bg-black">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        speed={1200}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
          bulletClass: 'swiper-pagination-bullet !bg-white/40 !w-2.5 !h-2.5 !mx-1.5 transition-all duration-300',
          bulletActiveClass: '!bg-white !w-10 !rounded-full !shadow-[0_0_10px_rgba(255,255,255,0.8)]',
        }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full overflow-hidden">
            {/* Background Image */}
            <img
              src={slide.imageUrl}
              alt={slide.headline}
              style={{ objectPosition: slide.imagePosition || 'center' }}
              className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-[10000ms] scale-100 hover:scale-105"
            />
            {/* Strong Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-[36px] md:bottom-[60px] lg:bottom-[80px] left-0 w-full px-5 md:px-12 lg:px-20 z-10">
              <div className="max-w-7xl mx-auto flex flex-col justify-end h-full">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-3 md:mb-4 leading-tight tracking-tight drop-shadow-2xl font-sans max-w-[320px] md:max-w-none">
                  {slide.headline}
                </h1>
                <p className="text-base md:text-xl lg:text-2xl text-gray-200 max-w-[320px] md:max-w-[550px] drop-shadow-xl font-medium leading-relaxed mb-6 md:mb-8 line-clamp-3 md:line-clamp-none">
                  {slide.description}
                </p>
                
                {/* Embedded CTA Buttons */}
                <div className="flex flex-row flex-wrap sm:flex-nowrap gap-3 md:gap-4">
                  <a
                    href="#tournaments"
                    className="inline-flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)] whitespace-nowrap"
                  >
                    View Tournaments
                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-1.5 md:gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-semibold px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base rounded-full transition-all duration-300 hover:scale-105 whitespace-nowrap"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Dots */}
      <div className="swiper-pagination-custom absolute bottom-4 md:bottom-6 w-full flex justify-center z-20" />

      {/* Glassmorphism Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-[12px] md:left-[16px] lg:left-[24px] top-1/2 -translate-y-1/2 z-20 flex w-10 h-10 md:w-14 md:h-14 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-white/20 hover:scale-110">
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        <span className="sr-only">Previous slide</span>
      </button>
      <button className="swiper-button-next-custom absolute right-[12px] md:right-[16px] lg:right-[24px] top-1/2 -translate-y-1/2 z-20 flex w-10 h-10 md:w-14 md:h-14 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-white/20 hover:scale-110">
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        <span className="sr-only">Next slide</span>
      </button>
    </div>
  );
}
