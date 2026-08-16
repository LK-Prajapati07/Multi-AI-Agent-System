import axios from 'axios'
import dotenv from 'dotenv'
import graph from '../graph/graph.js'
dotenv.config()
export const agent=async(req,res)=>{
    try {
        const {prompt,conversationId}=req.body
        await axios.post(`${process.env.CHAT_SERVICE}/save`,{
            conversationId, role:"user",content:prompt
        })
        const result=await graph.invoke({
            prompt,
            conversationId
        })

        // console.log(result)
       const responce= result.aiResponse
        await axios.post(`${process.env.CHAT_SERVICE}/save`,{
            conversationId, role:"assistant",content:responce
        })
       return res.status(200).json({
        data:responce,
        success:true,
        message:"Agent Service working now"
       })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}