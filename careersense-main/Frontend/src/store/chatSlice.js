import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  prediction: null,
  probability: null,
  currentSessionId: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setPrediction: (state, action) => {
      state.prediction = action.payload.prediction
      state.probability = action.payload.probability
    },
    clearChat: (state) => {
      state.messages = []
      state.prediction = null
      state.probability = null
      state.currentSessionId = null
    },
    setCurrentSessionId: (state, action) => {
      state.currentSessionId = action.payload
    },
    loadSession: (state, action) => {
      state.messages = action.payload.messages
      state.prediction = action.payload.prediction ?? null
      state.probability = action.payload.probability ?? null
      state.currentSessionId = action.payload.sessionId
    },
  },
})

export const { addMessage, setPrediction, clearChat, setCurrentSessionId, loadSession } = chatSlice.actions
export default chatSlice.reducer
