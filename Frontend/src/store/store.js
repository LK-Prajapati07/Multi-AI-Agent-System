import { configureStore } from '@reduxjs/toolkit'
import userReducer from './createSlice.js'
import conversationReducer from "./conversation.js"
import messageReducer from "./MessageSlice.js"
export const store = configureStore({
  reducer: {
   user: userReducer,
   conversation:conversationReducer,
   message:messageReducer,
  },
})