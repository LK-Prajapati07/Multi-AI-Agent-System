import api from "../../utils/axios"
const Logout=async()=>{
    try {
        const {data}=await api.get("/api/auth/logout")
       
        return data
    } catch (error) {
        console.log(error)        
    }
}
export default Logout