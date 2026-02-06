import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, Plus, Minus, Loader, ArrowLeft } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSingleProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import ReviewsContainer from '../components/Products/ReviewsContainer'
import { toast } from 'react-toastify'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const { productDetails, loading } = useSelector((state) => state.product)
  const wishlist = useSelector((state) => state.wishlist.items)
  const isInWishlist = wishlist.some((item) => item.id === productDetails?.id)

  // Fetch product details when component mounts or id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id))
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!productDetails || !productDetails.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  // Parse product data
  const price =
    typeof productDetails.price === 'string'
      ? parseFloat(productDetails.price)
      : productDetails.price
  const rating =
    typeof productDetails.ratings === 'string'
      ? parseFloat(productDetails.ratings)
      : productDetails.ratings || 0
  const images = productDetails.images || []
  const mainImage =
    images[selectedImage]?.url || 'https://via.placeholder.com/500x500?text=No+Image'

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: productDetails.id,
        name: productDetails.name,
        price: price,
        image: images[0]?.url || mainImage,
        quantity: quantity,
      }),
    )
    toast.success(`${quantity} item(s) added to cart!`)
    setQuantity(1)
  }

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < productDetails.stock) {
      setQuantity(quantity + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(productDetails.id))
      toast.info('Removed from wishlist')
    } else {
      dispatch(
        addToWishlist({
          id: productDetails.id,
          name: productDetails.name,
          price: price,
          image: images[0]?.url || mainImage,
          category: productDetails.category,
        }),
      )
      toast.success('Added to wishlist!')
    }
  }

  const handleShare = () => {
    const shareUrl = window.location.href
    const shareText = `Check out "${productDetails.name}" - ৳${price.toFixed(2)}`

    if (navigator.share) {
      navigator
        .share({
          title: productDetails.name,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {
          // Share failed, fallback to copy
          copyToClipboard(shareUrl)
        })
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(shareUrl)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link copied to clipboard!')
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
              <img src={mainImage} alt={productDetails.name} className="w-full h-96 object-cover" />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? 'border-blue-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            {/* Category */}
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase">
              {productDetails.category}
            </span>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              {productDetails.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({rating.toFixed(1)} - {productDetails.review_count || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                ৳{price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{productDetails.description}</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <p
                className={`text-sm font-semibold ${
                  productDetails.stock > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {productDetails.stock > 0 ? `${productDetails.stock} in stock` : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6 flex items-center gap-4">
              <span className="font-semibold text-gray-900 dark:text-white">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-semibold text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= productDetails.stock}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={productDetails.stock <= 0}
                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  productDetails.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className={`p-3 border-2 rounded-lg transition ${
                  isInWishlist
                    ? 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-red-600 dark:hover:border-red-400'
                }`}
                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={`w-5 h-5 transition ${
                    isInWishlist
                      ? 'fill-red-600 text-red-600 dark:fill-red-400 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition"
                title="Share this product"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewsContainer productId={id} reviews={productDetails.reviews || []} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
