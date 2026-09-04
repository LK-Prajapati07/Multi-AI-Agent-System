import express from 'express'
import { agent } from '../controller/agent.controller.js'
import  multer from "../config/multer.config.js"
const routes=express.Router()
routes.post("/chat",multer.single("file"),agent)
export default routes