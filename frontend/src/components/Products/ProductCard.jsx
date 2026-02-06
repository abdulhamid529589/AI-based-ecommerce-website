import React from 'react'
import { Star, ShoppingCart, Heart, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { toast } from 'react-toastify'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Handle product data with both id and _id
  const productId = product._id || product.id
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const rating =
    typeof product.ratings === 'string' ? parseFloat(product.ratings) : product.ratings || 0
  const image = product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'

  const handleAddToCart = (e) => {
    e.preventDefault()
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

  const handleBuyNow = (e) => {
    e.preventDefault()
    // Add to cart and navigate to checkout
    dispatch(
      addToCart({
        id: productId,
        name: product.name,
        price: price,
        image: image,
        quantity: 1,
      }),
    )
    toast.success('Added to cart! Proceeding to checkout...')
    setTimeout(() => {
      navigate('/payment')
    }, 500)
  }

  return (
    <div className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 h-48">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
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
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Price and Stock */}
          <div className="mt-auto pt-3">
            <p className="text-lg font-bold text-gray-900 dark:text-white">৳{price.toFixed(2)}</p>
            <p
              className={`text-xs ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            {/* Product Details Button */}
            <Link
              to={`/product/${productId}`}
              className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-center"
            >
              Details
            </Link>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1 ${
                product.stock > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add Cart</span>
            </button>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1 ${
                product.stock > 0
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={product.stock > 0 ? 'Buy Now - Direct Checkout' : 'Out of Stock'}
            >
              <Zap className="w-4 h-4" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
