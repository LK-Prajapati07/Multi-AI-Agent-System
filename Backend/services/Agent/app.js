import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.config.js'

import cookieParser from 'cookie-parser'
import  routes  from './routes/agent.routes.js'
dotenv.config()
const PORT=process.env.PORT
const app=express()
app.use(express.json())
app.use(cookieParser())
app.get("/",(req,res)=>{
    res.status(200).json({
 message:"Agent Services is running" 
    })
   
})
app.use("/",routes)


app.listen(PORT,()=>{
    console.log(`Your agent server running in http://localhost:${process.env.PORT}`)
    connectDB()
})