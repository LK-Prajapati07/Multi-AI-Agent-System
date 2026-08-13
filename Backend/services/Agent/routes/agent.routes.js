import express from 'express'
import { agent } from '../controller/agent.controller.js'
const routes=express.Router()
routes.post("/chat",agent)
export default routes