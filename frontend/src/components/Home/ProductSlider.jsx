import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { addToCart } from '../../store/slices/cartSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const ProductSlider = ({ title, products }) => {
  const dispatch = useDispatch()
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    const productId = product._id || product.id
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    const image = product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'

    dispatch(
      addToCart({
        id: productId,
        name: product.name,
        price: price,
        image: image,
        quantity: 1,
      }),
    )
    toast.success('Added to cart!')
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <Link
          to="/products"
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-sm"
        >
          View All →
        </Link>
      </div>

      <div className="relative">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/3 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition hidden md:flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition hidden md:flex items-center justify-center"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Products Container */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth">
          {products.map((product) => {
            const productId = product._id || product.id
            const price =
              typeof product.price === 'string' ? parseFloat(product.price) : product.price
            const rating =
              typeof product.ratings === 'string'
                ? parseFloat(product.ratings)
                : product.ratings || 0
            const image =
              product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'

            return (
              <Link key={productId} to={`/product/${productId}`} className="flex-shrink-0 w-64">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden h-full">
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 h-40">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition"
                    />
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Category */}
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                      {product.category}
                    </span>

                    {/* Name */}
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ৳{price.toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock <= 0}
                        className={`p-2 rounded-lg transition ${
                          product.stock > 0
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProductSlider
