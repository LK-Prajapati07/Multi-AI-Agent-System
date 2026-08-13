import express from "express"
import { createConversation, getConversations, getMessage, saveMessage, updateConversation } from "../controller/chat.controller.js"
const routes=express.Router()
routes.get("/create-conversation",createConversation)
routes.get("/get-conversation",getConversations)
routes.post("/save",saveMessage)
routes.put("/update",updateConversation)
routes.get("/message",getMessage)
export default routes