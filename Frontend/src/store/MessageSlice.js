import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Message: [],
  artifact:[]
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
    addArtifact:(state,action)=>{
      state.artifact.push(action.payload)
    }
  },
});

export const {
  setMessage,
  addMessage,
  addArtifact,
  clearMessage,
} = messageSlice.actions;

export default messageSlice.reducer;