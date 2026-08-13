import { Graph } from '@langchain/core/runnables/graph'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
export const agent=async(req,res)=>{
    try {
        const {prompt,conversationId}=req.body
        await axios.post(`${process.env.CHAT_SERVICE}/save`,{
            conversationId, role:"user",content:prompt
        })
        const result=await Graph.invoke({
            prompt,
            conversationId
        })
       const responce= result.aiResponse
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