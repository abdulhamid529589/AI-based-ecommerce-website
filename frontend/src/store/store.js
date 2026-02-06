import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import popupReducer from './slices/popupSlice'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    popup: popupReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    product: productReducer,
    order: orderReducer,
  },
})
