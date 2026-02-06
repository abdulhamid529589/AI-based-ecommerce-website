import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import SideBar from './components/SideBar'
import Dashboard from './components/Dashboard'
import Products from './components/Products'
import Orders from './components/Orders'
import Users from './components/Users'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { loginSuccess, logout } from './store/slices/authSlice'
import { ToastContainer } from 'react-toastify'
import {
  refreshAccessToken,
  setupTokenInterceptor,
  initializeAxiosToken,
} from './utils/tokenManager'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  // Load auth state from localStorage and setup token refresh on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user')
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      console.log('🔍 Initializing auth...', {
        storedUser: !!storedUser,
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
      })

      // Setup axios interceptor for token refresh (only once)
      setupTokenInterceptor()

      if (storedUser && accessToken && refreshToken) {
        try {
          // Set axios token immediately
          initializeAxiosToken()

          const userData = JSON.parse(storedUser)

          // Check if token is expired and refresh if needed
          const tokenExpiresAt = localStorage.getItem('tokenExpiresAt')
          if (tokenExpiresAt) {
            const timeUntilExpiry = parseInt(tokenExpiresAt) - new Date().getTime()

            // If token expires within 5 minutes, refresh it
            if (timeUntilExpiry < 5 * 60 * 1000) {
              console.log('⏰ Token expiring soon, refreshing...')
              const refreshSuccess = await refreshAccessToken()
              if (!refreshSuccess) {
                console.log('❌ Token refresh failed, logging out')
                dispatch(logout())
                setLoading(false)
                return
              }
            }
          }

          console.log('✅ Auth restored successfully')
          dispatch(loginSuccess(userData))
        } catch (error) {
          console.error('Error loading stored user:', error)
          localStorage.removeItem('user')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('tokenExpiresAt')
          dispatch(logout())
        }
      } else {
        console.log('⚠️ No stored tokens found')
      }

      setLoading(false)
    }

    initializeAuth()
  }, [dispatch])

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const ProtectedLayout = ({ children }) => {
    console.log('🔐 ProtectedLayout Check:', { isAuthenticated, user, role: user?.role })

    if (isAuthenticated && user?.role === 'Admin') {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
          <SideBar />
          <main className="flex-1 md:ml-[260px] overflow-auto md:min-h-screen pt-16 md:pt-0">
            {children}
          </main>
        </div>
      )
    }

    console.log('❌ Not authenticated or not admin - redirecting to login')
    return <Navigate to="/login" replace />
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedLayout>
              <Products />
            </ProtectedLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedLayout>
              <Orders />
            </ProtectedLayout>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedLayout>
              <Users />
            </ProtectedLayout>
          }
        />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  )
}

export default App
