import { Menu, User, ShoppingCart, Sun, Moon, Search, LogOut, Heart, X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { logout } from '../../store/slices/authSlice'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dispatch = useDispatch()

  const cartItemsCount = items?.length || 0

  const handleLogout = () => {
    dispatch(logout())
    setShowProfileMenu(false)
  }

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">E</span>
            </div>
            <span className="hidden sm:inline text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Shop
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-6 lg:mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Menu Button - Mobile (Order changed to be first) */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition active:scale-95"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Search - Mobile */}
            <button className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition active:scale-95">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Wishlist - Hidden on small mobile */}
            <Link
              to="/wishlist"
              className="hidden sm:flex p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative active:scale-95"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative active:scale-95"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition active:scale-95"
                aria-label="User profile"
              >
                {isAuthenticated && user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="Profile"
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                  />
                ) : isAuthenticated && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {/* Profile Dropdown Menu - Mobile friendly positioning */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 text-xs sm:text-sm animate-in fade-in duration-200">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white truncate text-xs sm:text-sm">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8 h-12 border-t border-gray-200 dark:border-gray-800 overflow-x-auto">
          <Link
            to="/products"
            className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap"
          >
            All Products
          </Link>
          <Link
            to="/products?category=electronics"
            className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap"
          >
            Electronics
          </Link>
          <Link
            to="/products?category=fashion"
            className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap"
          >
            Fashion
          </Link>
          <Link
            to="/products?category=home"
            className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap"
          >
            Home & Garden
          </Link>
          <Link
            to="/about"
            className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu - Modern smooth animation with better spacing */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-3 sm:px-4 py-3 space-y-1">
              <Link
                to="/products"
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setShowMobileMenu(false)}
              >
                All Products
              </Link>
              <Link
                to="/products?category=electronics"
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setShowMobileMenu(false)}
              >
                Electronics
              </Link>
              <Link
                to="/products?category=fashion"
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setShowMobileMenu(false)}
              >
                Fashion
              </Link>
              <Link
                to="/products?category=home"
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setShowMobileMenu(false)}
              >
                Home & Garden
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setShowMobileMenu(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
