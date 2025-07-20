import { createSlice } from '@reduxjs/toolkit'

// Đọc dữ liệu từ localStorage nếu có
const storedEmail = localStorage.getItem('adminEmail')
const storedLogin = localStorage.getItem('isLogin') === 'true'

const initialState = {
  isLogin: storedLogin || false,
  email: storedEmail || '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLogin = true
      state.email = action.payload.email
    },
    logout: (state) => {
      state.isLogin = false
      state.email = ''
      localStorage.removeItem('isLogin')
      localStorage.removeItem('adminEmail')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('adminData')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
