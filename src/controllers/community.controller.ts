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

        interface communityData {
            ownerId : string
            title : string
            discription : string
            rules : string

        }

        const communityData = {
            ownerId : userId,
            title,
            discription,
            rules
        }

        const community = await prisma.community.create({
            data: communityData as communityData,
            

        })

        if (!community) return res.status(500).json({
            "message" : "something happened while creating community",
            "status" : "failed"

        })

        // interface findCommunity {
        //     ownerId : string
        // }

        // const findCommunity = await prisma.community.findUnique({
        //     where : {
        //         ownerId : userId  
        //     } as any
        // })

        // console.log(findCommunity)

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

        const community = await prisma.community.findUnique({
            where : {
                title : communityTitle
            },
            select : {
                ownerId : true
            },
    

        })

        if (!community) return res.status(400).json({
            status : "failed",
            message : "the community doesnt exist anymore"
        })
        

        if (community?.ownerId !== userId) return res.status(400).json({
            status : "failed",
            message : "Not authorised, you cant edit it"
        });

       

        const communityUpdate = await prisma.community.update({
            where : {
                title : communityTitle
            },
            data : {
                title,
                discription,
                rules
            }
        })

        if (communityUpdate.title !== title || communityUpdate.rules !== rules || communityUpdate.discription !== discription) return res.status(400).json({
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
            "message" : error.message
        })
    }
}

export {createCommunity, updateCommunity, deleteCommunity}
