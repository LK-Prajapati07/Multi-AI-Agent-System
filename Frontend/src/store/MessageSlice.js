import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Message: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.Message = action.payload;
    },

    addMessage: (state, action) => {
      state.Message.push(action.payload);
    },

    clearMessage: (state) => {
      state.Message = [];
    },
  },
});

export const {
  setMessage,
  addMessage,
  clearMessage,
} = messageSlice.actions;

export default messageSlice.reducer;