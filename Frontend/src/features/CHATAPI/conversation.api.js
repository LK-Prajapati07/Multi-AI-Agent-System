import api from "../../utils/axios"

export const createConversation=async()=>{
    try {
        const {data}=await api.get("/api/chat/create-conversation",)
        return data
    } catch (error) {
        console.log("error occure during the api",error)
    }
}
export const getConversations=async()=>{
    try {
        const {data}=await api.get("/api/chat/get-conversation")
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}
export const saveMessage=async(payload)=>{
    try {
        const {data}=await api.post("/api/chat/save",{payload})
        return data
    } catch (error) {
        console.log(error)
    }
}
export const getMessage = async (conversationId) => {
  try {
    const { data } = await api.get(
      `/api/chat/message?conversationId=${conversationId}`
    );

    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const updateConversationTitle = async (payload) => {
  try {
    const { data } = await api.put("/api/chat/update", payload);
    return data;
  } catch (error) {
    console.error("Error updating conversation title:", error);
    throw error;
  }
};