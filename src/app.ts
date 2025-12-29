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

// const users = async () => {
//   return await prisma.user.findMany({
//     where: { role: Role.ADMIN },
//     include: {
//       profile: true
//     }
//   })
// }

// console.log(await users())

//route import
import userRouter from "./routes/user.routes"

app.use("/api/v0/users", userRouter)

import postRouter from "./routes/post.routes"

app.use("/api/v0/posts", postRouter)

import communityRouter from "./routes/community.routes"

app.use("/api/v0/communities", communityRouter)

export{ app };