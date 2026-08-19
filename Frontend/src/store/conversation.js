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
        },
        setSelectedTitle:(state,action)=>{
            const {title,conversationId} = action.payload;
            state.conversation = state.conversation.map((conversation)=>{
                if(conversation.id === conversationId){
                    return {
                        ...conversation,
                        title:title
                    }
                }
                return conversation;
            });
        }
    }
});

export const {
    setConversation,
    addConverastion,
    setSelectedConversations,
    setSelectedTitle
} = conversationSlice.actions;

export default conversationSlice.reducer;