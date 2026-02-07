import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  })
  const [useEmail, setUseEmail] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    let { name, value } = e.target

    // Format mobile number for Bangladeshi format
    if (name === 'mobile' && value) {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '')

      // If starts with 880, it's international format
      if (digitsOnly.startsWith('880')) {
        if (digitsOnly.length <= 12) {
          value =
            '+' +
            digitsOnly.slice(0, 3) +
            ' ' +
            digitsOnly.slice(3, 5) +
            ' ' +
            digitsOnly.slice(5, 8) +
            ' ' +
            digitsOnly.slice(8, 12)
        }
      } else if (digitsOnly.startsWith('1')) {
        // Local format (01XXXXXXXXX)
        if (digitsOnly.length <= 11) {
          value =
            '0' +
            digitsOnly.slice(0, 1) +
            ' ' +
            digitsOnly.slice(1, 4) +
            ' ' +
            digitsOnly.slice(4, 7) +
            ' ' +
            digitsOnly.slice(7, 11)
        }
      } else {
        // Auto-format as international if just digits
        if (digitsOnly.length <= 10) {
          value =
            '+880 1' +
            digitsOnly.slice(0, 2) +
            ' ' +
            digitsOnly.slice(2, 5) +
            ' ' +
            digitsOnly.slice(5, 10)
        }
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (useEmail && !formData.email) {
      toast.error('Please provide an email address')
      return
    }

    if (!useEmail && !formData.mobile) {
      toast.error('Please provide a mobile number')
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/auth/register', {
        name: formData.name,
        email: useEmail ? formData.email : '',
        mobile: !useEmail ? formData.mobile : '',
        password: formData.password,
      })

      if (response.data.success) {
        toast.success('Account created successfully!')
        window.location.href = '/'
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Join us today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Toggle Between Email and Mobile */}
            <div className="flex gap-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setUseEmail(true)}
                className={`flex-1 py-2 px-3 rounded text-xs sm:text-sm font-medium transition ${
                  useEmail
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Mail className="inline w-4 h-4 mr-1" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setUseEmail(false)}
                className={`flex-1 py-2 px-3 rounded text-xs sm:text-sm font-medium transition ${
                  !useEmail
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Phone className="inline w-4 h-4 mr-1" />
                Mobile
              </button>
            </div>

            {/* Email Input */}
            {useEmail && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    required={useEmail}
                  />
                </div>
              </div>
            )}

            {/* Mobile Input */}
            {!useEmail && (
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
                >
                  Mobile Number (Bangladesh)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+880 1XX XXX XXXX"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    required={!useEmail}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5">
                  Format: +880 1XX XXX XXXX or 01XXXXXXXXX
                </p>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5">
                Password must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
