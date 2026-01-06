import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../db/prisma";




const createPost = async(req : AuthRequest, res:Response)=>{

    try {


        if (!req.user) return res.status(401).json({message: "Unauthorised"});

        const {userId, emailId, phoneNumber} = req.user

        const {communityId} = req.params
        console.log(communityId)
        const {title, body } = req.body

        if (!communityId) return res.status(400).json({
            status : "failed",
            message : "pls select a community"
        })

        // validations

        if([title, body].some((val)=>(val.trim() === ""))) return res.status(400).json({status: "failed", message:"all feilds are required"});

       
        

        const post = await prisma.post.create({
            data : {
                title,
                body,
                author : {
                    connect : {userId : userId}
                },
                community : {
                    connect : {communityId : communityId}
                }

            }
        })

        

        if (!post) return res.status(500).json({
            "message" : "something happened while creating post",
            "status" : "failed"

        })


        res.status(200).json({
            status : "success",
            message : "the post has been created",
            post : post
        })

        
    } catch (error: any) {
        res.status(500).json({
            message: "something is wrong, creation failed",
            errMessage: error.message
        })
    }
   





    


    


}


const updatePost = async(req:AuthRequest, res:Response)=>{
    try {

        if(!req.user) return res.status(400).json({
            "message" : "user not authenticated",
            "status" : "failed"
        })

        const {title, body } = req.body

        // validations

        if([title, body].some((val)=>(val.trim() === ""))) return res.status(400).json({status: "failed", message:"all feilds are required"});

        const {userId} = req.user

        const {communityId, postId} = req.params

        

       

        const postUpdate = await prisma.post.updateMany({
            where : {
                communityId : communityId,
                authorId : userId,
                postId : postId
            },
            data : {
                title,
                body,
            
            }
        })

        if (postUpdate.count === 0) return res.status(400).json({
            status : "faild",
            message : "something went wrong while updating"
        })

        res.status(200).json({
            status : "success",
            message : "the community has been updated",
            postUpdate : postUpdate.count
        })


        




     



        
        
    } catch (error:any) {
        res.status(500).json({
            "status" : "failed",
            "message" : error.message
        })
    }
}   



const deletePost = async(req: AuthRequest, res: Response )=>{
    try {

        if(!req.user) return res.status(400).json({
            "message" : "user not authenticated",
            "status" : "failed"
        })

        const {userId} = req.user

        const {communityId, postId} = req.params;

        const postDelete = await prisma.post.deleteMany({
            where : {
                communityId : communityId,
                postId : postId,
                authorId : userId
            }
        })

        console.log(postDelete)

        if (postDelete.count === 0) return res.status(400).json({
            status : "faild",
            message : "something went wrong while deleting"
        })

        res.status(200).json({
            status : "success",
            message : "the community has been deleted",
            postDelete: postDelete.count
        })
        

      
        
    } catch (error: any) {
        res.status(400).json({
            "status" : "failed",
            "message" : error.message
        })
    }
}

export {createPost,updatePost, deletePost }
