import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversation: [],
    selectedConversation:null
};

const conversationSlice = createSlice({
    name: "conversation",
    initialState,

    reducers: {
        setConversation: (state, action) => {
            state.conversation = action.payload;
        },

        addConverastion: (state, action) => {
            state.conversation.unshift(action.payload);
        },
        setSelectedConversations:(state,action)=>{
               state.selectedConversation = action.payload;
        }
    }
});

export const {
    setConversation,
    addConverastion,
    setSelectedConversations
} = conversationSlice.actions;

export default conversationSlice.reducer;