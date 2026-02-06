import { Menu, User, ShoppingCart, Sun, Moon, Search, LogOut, Heart, X, Home, Heart as Favorites, Package, Phone } from 'lucide-react'
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
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const dispatch = useDispatch()

  const cartItemsCount = items?.length || 0

  const handleLogout = () => {
    dispatch(logout())
    setShowProfileMenu(false)
    setShowMobileMenu(false)
  }

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
    setShowMobileSearch(false)
  }

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0" onClick={closeMobileMenu}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base sm:text-lg md:text-xl">E</span>
            </div>
            <span className="hidden sm:inline text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Shop
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-6 lg:mx-10">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base transition"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Menu Button - Mobile */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              title="Menu"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Search - Mobile */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
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
              className="hidden sm:flex p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative active:scale-95 min-h-[44px] min-w-[44px] items-center justify-center"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Shopping cart"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="User profile"
                title="Profile"
              >
                {isAuthenticated && user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="Profile"
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                  />
                ) : isAuthenticated && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {/* Profile Dropdown Menu - Mobile friendly positioning */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 text-sm animate-in fade-in duration-200">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
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

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                autoFocus
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Secondary Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 h-12 border-t border-gray-200 dark:border-gray-800 overflow-x-auto">
          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            All Products
          </Link>
          <Link
            to="/products?category=electronics"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            Electronics
          </Link>
          <Link
            to="/products?category=fashion"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            Fashion
          </Link>
          <Link
            to="/products?category=home"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            Home & Garden
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu - Enhanced with better UX */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 max-h-[calc(100vh-60px)] overflow-y-auto">
            <div className="px-3 sm:px-4 py-3 space-y-1">
              {/* Main Navigation Links */}
              <Link
                to="/products"
                className="flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-base hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                onClick={closeMobileMenu}
              >
                <Package className="w-5 h-5" />
                All Products
              </Link>

              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

              {/* Categories */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories
              </div>
              <Link
                to="/products?category=electronics"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                onClick={closeMobileMenu}
              >
                Electronics
              </Link>
              <Link
                to="/products?category=fashion"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                onClick={closeMobileMenu}
              >
                Fashion
              </Link>
              <Link
                to="/products?category=home"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                onClick={closeMobileMenu}
              >
                Home & Garden
              </Link>

              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

              {/* Quick Links */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quick Links
              </div>
              <Link
                to="/"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                onClick={closeMobileMenu}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                onClick={closeMobileMenu}
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                onClick={closeMobileMenu}
              >
                <Phone className="w-4 h-4" />
                Contact
              </Link>

              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

              {/* User Section */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Account
              </div>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                    onClick={closeMobileMenu}
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-6 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition font-medium text-sm active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-3 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg rounded-lg transition font-semibold text-sm active:scale-95 mt-2"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
