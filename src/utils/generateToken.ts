import jwt from 'jsonwebtoken'
import { env } from 'process'
import { Response } from 'express'



export const generateToken = (userId: string, res:Response)=>{
    const payload = {id: userId}
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "7d"
    })

    

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "prooduction",
        sameSite: true,
        maxAge: (1000 * 60 * 60 * 24) * 7
    } )
    return token;

}


