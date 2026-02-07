import { Search, Sparkles, Star, Filter, Loader, X, ChevronDown } from 'lucide-react'
import { categories } from '../data/products'
import ProductCard from '../components/Products/ProductCard'
import ProductSkeleton from '../components/Products/ProductSkeleton'
import Pagination from '../components/Products/Pagination'
import AISearchModal from '../components/Products/AISearchModal'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchAllProducts } from '../store/slices/productSlice'

const Products = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [currentPage, setCurrentPage] = useState(1)
  const [showAISearch, setShowAISearch] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevant')
  const productsPerPage = 12

  const { products, loading } = useSelector((state) => state.product)
  const searchTerm = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || 'all'
  const subcategoryParam = searchParams.get('subcategory') || 'all'

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  // Update selected category from URL parameter
  useEffect(() => {
    setSelectedCategory(categoryParam)
    setSelectedSubcategory(subcategoryParam)
    setCurrentPage(1)
  }, [categoryParam, subcategoryParam])

  // Get current category data
  const getCategoryUrl = (categoryName) => {
    return categoryName
      .toLowerCase()
      .replace(/\s+&\s+/g, '-')
      .replace(/\s+/g, '-')
  }

  const currentCategoryData = categories.find(
    (cat) => getCategoryUrl(cat.name) === selectedCategory,
  )

  // Get available subcategories for current category
  const getSubcategoryOptions = () => {
    if (!currentCategoryData || !currentCategoryData.subcategories) return []
    return Object.entries(currentCategoryData.subcategories).flatMap(([section, items]) =>
      items.map((item) => ({
        ...item,
        section,
      })),
    )
  }

  // Handle category change - update URL and reset subcategory
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSelectedSubcategory('all')
    setCurrentPage(1)
    if (category === 'all') {
      navigate('/products')
    } else {
      navigate(`/products?category=${category}`)
    }
  }

  // Handle subcategory change - update URL
  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory)
    setCurrentPage(1)
    if (subcategory === 'all') {
      navigate(`/products?category=${selectedCategory}`)
    } else {
      navigate(`/products?category=${selectedCategory}&subcategory=${getCategoryUrl(subcategory)}`)
    }
  }

  // Filter and search products
  useEffect(() => {
    let result = products

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase(),
      )
    }

    // Filter by subcategory
    if (selectedSubcategory !== 'all' && selectedCategory !== 'all') {
      result = result.filter(
        (product) =>
          product.subcategory?.toLowerCase() === getCategoryUrl(selectedSubcategory).toLowerCase(),
      )
    }

    // Filter by price range
    result = result.filter((product) => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price
          const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price
          return priceA - priceB
        })
        break
      case 'price-desc':
        result.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price
          const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price
          return priceB - priceA
        })
        break
      case 'rating':
        result.sort((a, b) => {
          const ratingA = typeof a.ratings === 'string' ? parseFloat(a.ratings) : a.ratings || 0
          const ratingB = typeof b.ratings === 'string' ? parseFloat(b.ratings) : b.ratings || 0
          return ratingB - ratingA
        })
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        // relevant - keep as is
        break
    }

    setFilteredProducts(result)
    setCurrentPage(1)
  }, [products, searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  // Get unique categories from categories array
  const categoryNames = categories.map((cat) => cat.name.toLowerCase())
  const subcategoryOptions = getSubcategoryOptions()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {selectedCategory === 'all'
              ? 'Our Products'
              : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}${
                  selectedSubcategory !== 'all'
                    ? ` - ${selectedSubcategory.charAt(0).toUpperCase() + selectedSubcategory.slice(1)}`
                    : ''
                } Products`}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {selectedCategory === 'all'
              ? 'Discover our amazing collection of products'
              : `Browse our collection of ${selectedCategory}${
                  selectedSubcategory !== 'all' ? ` ${selectedSubcategory}` : ''
                } products`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6 flex gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          <button
            onClick={() => setShowAISearch(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition font-medium"
          >
            <Sparkles className="w-5 h-5" />
            <span>AI Search</span>
          </button>
        </div>

        {/* Active Filters and Sort */}
        <div className="mb-6 space-y-4">
          {/* Active Filters Indicator */}
          {(selectedCategory !== 'all' ||
            selectedSubcategory !== 'all' ||
            priceRange[1] < 100000) && (
            <div className="flex flex-wrap gap-2 items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Filters:
              </span>
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium flex items-center gap-1">
                  {selectedCategory}
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className="ml-1 hover:opacity-70"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedSubcategory !== 'all' && (
                <span className="px-3 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium flex items-center gap-1">
                  {selectedSubcategory}
                  <button
                    onClick={() => handleSubcategoryChange('all')}
                    className="ml-1 hover:opacity-70"
                  >
                    ✕
                  </button>
                </span>
              )}
              {priceRange[1] < 100000 && (
                <span className="px-3 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium flex items-center gap-1">
                  Price: ৳{priceRange[0]}-{priceRange[1]}
                  <button
                    onClick={() => setPriceRange([0, 100000])}
                    className="ml-1 hover:opacity-70"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition"
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} results
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Hidden on mobile, visible on lg+ */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
              {/* AI Search Button */}
              <button
                onClick={() => setShowAISearch(true)}
                className="w-full mb-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition"
              >
                <Sparkles className="w-5 h-5" />
                <span>AI Search</span>
              </button>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">All Categories</span>
                  </label>
                  {categoryNames.map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategories - Only show when a category is selected */}
              {selectedCategory !== 'all' && subcategoryOptions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Subcategories
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="subcategory"
                        value="all"
                        checked={selectedSubcategory === 'all'}
                        onChange={(e) => handleSubcategoryChange(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">All</span>
                    </label>
                    {subcategoryOptions.map((sub) => (
                      <label key={sub.id} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="subcategory"
                          value={sub.name}
                          checked={selectedSubcategory === sub.name}
                          onChange={(e) => handleSubcategoryChange(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
                          {sub.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>৳{priceRange[0]}</span>
                    <span>৳{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(12)].map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))}
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id || product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <Search className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Search Modal */}
      {showAISearch && <AISearchModal onClose={() => setShowAISearch(false)} />}

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl animate-in slide-in-from-bottom-5 duration-300 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                  Categories
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                      All Categories
                    </span>
                  </label>
                  {categoryNames.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center cursor-pointer p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium capitalize">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategories - Only show when a category is selected */}
              {selectedCategory !== 'all' && subcategoryOptions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                    Subcategories
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition">
                      <input
                        type="radio"
                        name="subcategory"
                        value="all"
                        checked={selectedSubcategory === 'all'}
                        onChange={(e) => handleSubcategoryChange(e.target.value)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">All</span>
                    </label>
                    {subcategoryOptions.map((sub) => (
                      <label
                        key={sub.id}
                        className="flex items-center cursor-pointer p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition"
                      >
                        <input
                          type="radio"
                          name="subcategory"
                          value={sub.name}
                          checked={selectedSubcategory === sub.name}
                          onChange={(e) => handleSubcategoryChange(e.target.value)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium text-sm">
                          {sub.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                      setCurrentPage(1)
                    }}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span>৳{priceRange[0].toLocaleString()}</span>
                    <span>৳{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
