import { Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { updateCartQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartState = useSelector((state) => state.cart)
  const cartItems = useMemo(() => cartState?.items || [], [cartState])

  // Calculate totals
  const subtotal = (cartItems || []).reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 150 : 0
  const total = subtotal + shipping

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartQuantity({ id: itemId, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId))
    toast.success('Item removed from cart')
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart())
      toast.success('Cart cleared')
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty')
      return
    }
    navigate('/payment')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <ShoppingCart className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add items to your cart to continue shopping
            </p>
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {cartItems.length} item(s) in cart
                </p>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 dark:text-red-400 hover:underline text-sm font-semibold"
                >
                  Clear Cart
                </button>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {/* Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ৳{item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex flex-col items-end gap-4">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 dark:text-red-400 hover:underline text-sm font-semibold"
                      >
                        Remove
                      </button>

                      {/* Subtotal */}
                      <p className="font-bold text-gray-900 dark:text-white">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal:</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400 italic">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block w-full py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-bold rounded-lg hover:border-gray-400 dark:hover:border-gray-500 text-center transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
