import api from "../utils/axios"

const callAgent=async(payload)=>{
    try {
        const {data}=await api.post("/api/agent/chat",payload)
        console.log(data)
        return data
    } catch (error) {
        console.log(error || "Error Occure calling the agent services")
    }
}
export default callAgent