import { createSlice } from '@reduxjs/toolkit'

// Initialize cart from localStorage
const storedCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: storedCart,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        existingItem.quantity += item.quantity || 1
      } else {
        state.items.push({
          ...item,
          quantity: item.quantity || 1,
        })
      }
      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    updateCartQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    setCart: (state, action) => {
      state.items = action.payload
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
  },
})

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, setCart } =
  cartSlice.actions

export default cartSlice.reducer
