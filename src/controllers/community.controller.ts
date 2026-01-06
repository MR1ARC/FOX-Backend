import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../db/prisma";
import { statSync } from "node:fs";

const createCommunity = async(req : AuthRequest, res:Response)=>{

    try {

        if (!req.user) return res.status(401).json({message: "Unauthorised"});

        const {userId, emailId, phoneNumber} = req.user

        const {title, discription, rules } = req.body

        // validations

        if([title, discription, rules].some((val)=>(val.trim() === ""))) return res.status(400).json({status: "failed", message:"all feilds are required"});

        const alreadyExists = await prisma.community.findUnique({
            where : {
                title : title
            } 
        })

        if (alreadyExists) return res.status(400).json({message: "community already exists", status: "failed"})

        

        const community = await prisma.community.create({
            data: {
                title,
                discription,
                rules,
                owner : {
                    connect : {userId : userId}
                }
            }
            

        })

        if (!community) return res.status(500).json({
            "message" : "something happened while creating community",
            "status" : "failed"

        })


        res.status(200).json({
            status : "success",
            message : "the community has been created",
            community : community
        })

        
    } catch (error: any) {
        res.status(500).json({
            message: "something is wrong, creation failed",
            errMessage: error.message
        })
    }
   





    


    


}


const updateCommunity = async(req:AuthRequest, res:Response)=>{
    try {

        if(!req.user) return res.status(400).json({
            "message" : "user not authenticated",
            "status" : "failed"
        })

        const {title, discription, rules } = req.body

        // validations

        if([title, discription, rules].some((val)=>(val.trim() === ""))) return res.status(400).json({status: "failed", message:"all feilds are required"});

        const {userId} = req.user

        const {communityTitle} = req.params


        const communityUpdate = await prisma.community.updateMany({
            where : {
                title : communityTitle,
                ownerId : userId
            },
            data : {
                title,
                discription,
                rules
            }
        })

        if (communityUpdate.count === 0) return res.status(400).json({
            status : "faild",
            message : "something went wrong while updating"
        })

        res.status(200).json({
            status : "success",
            message : "the community has been updated",
            community : communityUpdate
        })


        




     



        
        
    } catch (error:any) {
        res.status(500).json({
            "status" : "failed",
            "message" : error.message
        })
    }
}   



const deleteCommunity = async(req: AuthRequest, res: Response )=>{
    try {

        if(!req.user) return res.status(400).json({
            "message" : "user not authenticated",
            "status" : "failed"
        })

        const {userId} = req.user

        const {communityTitle} = req.params;

        const communityDelete = await prisma.community.delete({
            where : {
                title : communityTitle
            }
        })

        res.status(200).json({
            status : "success",
            message : "the community has been deleted",
            community : communityDelete
        })
        

      
        
    } catch (error: any) {
        res.status(400).json({
            "status" : "failed",
            "message" : error.message,
            "err": error
        })
    }
}

export {createCommunity, updateCommunity, deleteCommunity}
