import React from 'react'
import HeroSlider from '../components/Home/HeroSlider'
import CategoryGrid from '../components/Home/CategoryGrid'
import ProductSlider from '../components/Home/ProductSlider'
import FeatureSection from '../components/Home/FeatureSection'
import NewsletterSection from '../components/Home/NewsletterSection'
import RecentlyViewed from '../components/Products/RecentlyViewed'
import { useSelector } from 'react-redux'

const Index = () => {
  const { topRatedProducts, newProducts } = useSelector((state) => state.product)
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20">
        <CategoryGrid />
        <RecentlyViewed />
        {newProducts.length > 0 && <ProductSlider title="New Arrivals" products={newProducts} />}
        {topRatedProducts.length > 0 && (
          <ProductSlider title="Top Rated Products" products={topRatedProducts} />
        )}
        <FeatureSection />
        <NewsletterSection />
      </div>
    </div>
  )
}

export default Index
