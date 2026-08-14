import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Message: []
    
};

const MessageSlice = createSlice({
    name: "MessageSlice",
    initialState,

    reducers: {
        setMessage: (state, action) => {
            state.Message = action.payload;
        },

      
    }
});

export const {
    setMessage,

} = MessageSlice.actions;

export default MessageSlice.reducer;