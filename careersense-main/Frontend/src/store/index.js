import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import chatReducer from './chatSlice'

const PERSIST_KEY = 'careersense_redux'

function loadState() {
  try {
    const serialized = localStorage.getItem(PERSIST_KEY)
    return serialized ? JSON.parse(serialized) : undefined
  } catch {
    return undefined
  }
}

function saveState(state) {
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(state))
  } catch {}
}

const preloadedState = loadState()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
  preloadedState,
})

// save to localStorage on every state change
store.subscribe(() => {
  saveState(store.getState())
})
