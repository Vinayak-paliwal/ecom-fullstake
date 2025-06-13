import { configureStore } from '@reduxjs/toolkit'
import cartSystem from '../Slice/CartSlice'
import getUserSlice from '../Slice/GetUserSlice'

export const store = configureStore({
  reducer: {
    cart:cartSystem,
    userInfo:getUserSlice,
  },
})