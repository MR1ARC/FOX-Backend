import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import { prisma, Role } from "./db/prisma";
import "dotenv/config";




const app = express(); 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
 

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes"

app.use("/api/v0/users", userRouter)

import communityRouter from "./routes/community.routes"

app.use("/api/v0/communities", communityRouter)


import postRouter from "./routes/post.routes"

app.use("/api/v0/post", postRouter)

export{ app };