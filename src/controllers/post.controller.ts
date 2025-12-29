import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";

const createPost = async(req : AuthRequest, res:Response)=>{

    try {

        if (!req.user) return res.status(401).json({message: "Unauthorised"});

        const {userId, emailId, phoneNumber} = req.user

        const {title, body} = req.body

        res.status(200).json({message: "working all fine..."})
        
    } catch (error: any) {
        res.status(500).json({
            message: "something is wrong, creation failed",
            errMessage: error.message
        })
    }
   





    


    


}

export {createPost}



