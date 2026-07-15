import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userName: localStorage.getItem('userName') || '',
  userEmail: localStorage.getItem('userEmail') || '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true
      state.userName = action.payload.name
      state.userEmail = action.payload.email
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userName', action.payload.name)
      localStorage.setItem('userEmail', action.payload.email)
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.userName = ''
      state.userEmail = ''
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
