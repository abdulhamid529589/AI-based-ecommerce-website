import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: 'Premium Electronics',
      subtitle: 'Discover the latest tech innovations',
      description: 'Up to 50% off on premium headphones, smartwatches, and more',
      image: './electronics.jpg',
      cta: 'Shop Electronics',
      url: '/products?category=Electronics',
    },
    {
      id: 2,
      title: 'Fashion Forward',
      subtitle: 'Style meets comfort',
      description: 'New arrivals in designer clothing and accessories',
      image: './fashion.jpg',
      cta: 'Explore Fashion',
      url: '/products?category=Fashion',
    },
    {
      id: 3,
      title: 'Home & Garden',
      subtitle: 'Transform your space',
      description: 'Beautiful furniture and decor for every home',
      image: './furniture.jpg',
      cta: 'Shop Home',
      url: `/products?category=Home & Garden`,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const slide = slides[currentSlide]

  return (
    <div className="relative h-[55vh] sm:h-[65vh] md:h-[75vh] overflow-hidden rounded-lg sm:rounded-2xl shadow-lg">
      {/* Single Active Slide */}
      <div className="relative h-full">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
        {/* Enhanced Gradient Overlay - Better for text readability on mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
        <div className="absolute inset-0 glass" />

        {/* Content Container - Better mobile layout */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          <div className="max-w-2xl sm:max-w-3xl animate-fade-in-up w-full space-y-3 sm:space-y-4 md:space-y-6">
            {/* Subtitle - More prominent on mobile */}
            <div className="inline-block">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600/20 border border-blue-400/50 rounded-full text-xs sm:text-sm font-semibold text-blue-300 backdrop-blur-sm">
                {slide.subtitle}
              </span>
            </div>

            {/* Title - Better scaling for mobile */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              {slide.title}
            </h1>

            {/* Description - Better visibility */}
            <p className="text-sm sm:text-base md:text-lg text-gray-100 max-w-xl mx-auto line-clamp-2 sm:line-clamp-3 drop-shadow-md font-medium">
              {slide.description}
            </p>

            {/* CTA Button - Mobile optimized */}
            <div className="pt-2 sm:pt-4">
              <Link
                to={slide.url}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 md:py-5 gradient-primary text-white rounded-lg hover:glow-on-hover active:scale-95 transition-all duration-200 font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl whitespace-nowrap touch-none"
              >
                {slide.cta}
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Swipe Indicators - Better UX hint */}
      <div className="absolute top-4 right-4 sm:hidden bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white font-medium flex items-center gap-1">
        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
        Swipe to explore
      </div>

      {/* Navigation Arrows - Desktop only */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-3 md:left-6 top-1/2 transform -translate-y-1/2 p-2 md:p-3 glass-card hover:glow-on-hover hover:bg-white/20 active:scale-90 transition-all duration-150 z-10 items-center justify-center rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-3 md:right-6 top-1/2 transform -translate-y-1/2 p-2 md:p-3 glass-card hover:glow-on-hover hover:bg-white/20 active:scale-90 transition-all duration-150 z-10 items-center justify-center rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </button>

      {/* Dots Navigation - Smaller dots for cleaner mobile UX */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full transition-all duration-300 transform hover:scale-110 active:scale-90 ${
              index === currentSlide
                ? 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white shadow-md glow-primary'
                : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
          />
        ))}
      </div>

      {/* Slide Counter - Mobile friendly */}
      <div className="absolute top-4 left-4 sm:left-6 text-white text-xs sm:text-sm font-semibold bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  )
}

export default HeroSlider
