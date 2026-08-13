import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.config.js'
import routes from './router/auth.routes.js'
import cookieParser from 'cookie-parser'
dotenv.config()
const PORT=process.env.PORT
const app=express()
app.use(express.json())
app.use(cookieParser())
app.get("/",(req,res)=>{
    res.status(200).json({
 message:"Auth Services is running"
    })
   
})
app.use("/",routes)
app.listen(PORT,()=>{
    console.log(`Your auth server running in http://localhost:${process.env.PORT}`)
    connectDB()
})