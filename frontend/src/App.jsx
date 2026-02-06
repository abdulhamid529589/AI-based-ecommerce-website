import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { ToastContainer } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

// Layout Components
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import SearchOverlay from './components/Layout/SearchOverlay'
import CartSidebar from './components/Layout/CartSidebar'
import ProfilePanel from './components/Layout/ProfilePanel'
import LoginModal from './components/Layout/LoginModal'
import Footer from './components/Layout/Footer'

// Pages
import Index from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'

// Store
import { fetchAllProducts } from './store/slices/productSlice'

const AppContent = () => {
  const dispatch = useDispatch()

  // Fetch products on app mount
  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <SearchOverlay />
      <CartSidebar />
      <ProfilePanel />
      <LoginModal />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <>
      <ThemeProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <AppContent />
            <ToastContainer />
          </BrowserRouter>
        </CurrencyProvider>
      </ThemeProvider>
    </>
  )
}

export default App
