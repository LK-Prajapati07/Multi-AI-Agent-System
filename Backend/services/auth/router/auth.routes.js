import express from 'express'
import { createUser, getCurrentUser, logout } from '../controller/auth.controller.js'
import { protect } from '../../../shared/protect.js'

const routes=express.Router()
routes.post("/login",createUser)
routes.get("/logout",logout)
routes.get("/me",protect,getCurrentUser)

export default routes