import { Search, Sparkles, Star, Filter, Loader } from 'lucide-react'
import { categories } from '../data/products'
import ProductCard from '../components/Products/ProductCard'
import Pagination from '../components/Products/Pagination'
import AISearchModal from '../components/Products/AISearchModal'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchAllProducts } from '../store/slices/productSlice'

const Products = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [currentPage, setCurrentPage] = useState(1)
  const [showAISearch, setShowAISearch] = useState(false)
  const productsPerPage = 12

  const { products, loading } = useSelector((state) => state.product)
  const searchTerm = searchParams.get('q') || ''

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

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

    // Filter by price range
    result = result.filter((product) => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    setFilteredProducts(result)
    setCurrentPage(1)
  }, [products, searchTerm, selectedCategory, priceRange])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  // Get unique categories from categories array
  const categoryNames = categories.map((cat) => cat.name.toLowerCase())

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Products</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover our amazing collection of products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
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
                      onChange={(e) => setSelectedCategory(e.target.value)}
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
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

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
              <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
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
    </div>
  )
}

export default Products
