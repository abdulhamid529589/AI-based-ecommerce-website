import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'
import { toast } from 'react-toastify'

// Async thunk to fetch all products
export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/product/')
      return response.data.products || []
    } catch (error) {
      console.error('Error fetching products:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  },
)

// Async thunk to fetch single product
export const fetchSingleProduct = createAsyncThunk(
  'product/fetchSingleProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/product/singleProduct/${productId}`)
      return response.data.product || {}
    } catch (error) {
      console.error('Error fetching product:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
    }
  },
)

// Async thunk to post review
export const postProductReview = createAsyncThunk(
  'product/postProductReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/product/post-new/review/${productId}`, {
        rating,
        comment,
      })
      return response.data
    } catch (error) {
      console.error('Error posting review:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to post review')
    }
  },
)

// Async thunk to delete review
export const deleteReview = createAsyncThunk(
  'product/deleteReview',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/product/delete/review/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting review:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review')
    }
  },
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    loading: false,
    products: [],
    productDetails: {},
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
        state.totalProducts = action.payload.length
        // Separate top rated and new products
        state.topRatedProducts = action.payload.filter((p) => p.ratings >= 4) || []
        state.newProducts = action.payload.slice(-5).reverse() || []
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false
        console.error('Failed to fetch products:', action.payload)
      })

    // Fetch single product
    builder
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false
        state.productDetails = action.payload
        state.productReviews = action.payload.reviews || []
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false
        console.error('Failed to fetch product:', action.payload)
      })

    // Post review
    builder
      .addCase(postProductReview.pending, (state) => {
        state.isPostingReview = true
      })
      .addCase(postProductReview.fulfilled, (state, action) => {
        state.isPostingReview = false
        toast.success('Review posted successfully')
      })
      .addCase(postProductReview.rejected, (state, action) => {
        state.isPostingReview = false
        toast.error(action.payload || 'Failed to post review')
      })

    // Delete review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false
        toast.success('Review deleted successfully')
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isReviewDeleting = false
        toast.error(action.payload || 'Failed to delete review')
      })
  },
})

export default productSlice.reducer
