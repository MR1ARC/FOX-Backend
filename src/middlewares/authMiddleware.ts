import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../db/prisma"

interface AuthenticatedUser {
    userId: string;
    emailId: string;
    phoneNumber: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: AuthenticatedUser;
}

export const authenticate = async(req:AuthRequest, res: Response, next: NextFunction)=>{

    try {

        interface Mytoken {
            id: string
            iat: number
            exp: number
        
        }
        const token = req.cookies.jwt
        console.log(token)
        if (!token) return res.status(401).json({
            status: "failed",
            message: "Not Authenticated"

        })

        const decode  = jwt.verify(token, process.env.JWT_SECRET! ) as Mytoken
        
        const userId = decode.id

        const user  = await prisma.user.findUnique({
            where : {
                userId : userId
            },
            omit : {
                password: true
            }
        })

        if(!user) return res.status(401).json({
            status: "failed",
            message: "user not found"
        });

        
        
        req.user = user as AuthenticatedUser

        next()
        
    } catch (error: any) {
        res.status(401).json({
            status: "failed",
            message: "invalid token",
            errMessase: error.message
        })
    }

    


}