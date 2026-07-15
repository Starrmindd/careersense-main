import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  prediction: null,
  probability: null,
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
    },
  },
})

export const { addMessage, setPrediction, clearChat } = chatSlice.actions
export default chatSlice.reducer
