
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { constrainedMemory, send } from "node:process";
import { prisma } from "../db/prisma";
import { generateToken } from "../utils/generateToken";
import { stat } from "node:fs";



//-------Register a user---------//

const registerUser = async(req:Request , res:Response) => {

    try {

        const {emailId, password, phoneNumber} = req.body

        
        //Validations 


        if ([emailId, password, phoneNumber].some((val)=>(val.trim() === ""))) return res.status(401).json({status: "faild", message: "all feilds are required"});

        if (!emailId.trim().endsWith("@gmail.com")) return res.status(401).json({status: "faild", message: "Please enter a valid email"});

        const alreadyExist = await prisma.user.findUnique({
            where: {
                emailId: emailId.trim()
            }
        })

        if(alreadyExist) return res.status(400).json({
            "status" : "registration failed",
            "message": "user already exists"
        })

        const salt =  await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt) 

        interface User {
            emailId: string
            password: string
            phoneNumber: string
        }

        const userData: User = {
            emailId: emailId.trim(),
            phoneNumber: phoneNumber.trim(),
            password: hashedPassword
        }


        

        const user = await prisma.user.create(
            {
                data: userData
            }
        )


        if(user){

            const token = generateToken(user.userId, res)

            res.status(200).json({
                status: "success",
                message: "user created",
                user: user,
                
            })
        }else {
            res.status(403).json({
                message: "user not created"
            })
        }

    } catch (error:any) {
        res.status(500).json({
            status: "registration faild",
            message: error.message
        })
    }





}




//-----long in a user-------//

const loginUser = async(req: Request, res: Response) => {

    try {


        const {emailId, password} = req.body

        //validations

        if ([emailId, password].some((v)=>(v.trim() === ''))) return res.status(400).json({"status": "failed", "message": "all feilds are mendatory"});


        const checkEmailId = await prisma.user.findUnique({
            where: {
                emailId: emailId.trim()
            }
        })

        // console.log(checkEmailId)


        if (checkEmailId){
            const hashedPassword = await bcrypt.compare(password.trim(), checkEmailId?.password )
        

      

            // console.log(password)
            // console.log(hashedPassword)

            // const salt = await bcrypt.genSalt(10)
            // const hash = await bcrypt.hash("jhj", salt)

            // console.log(hash)

            if (!hashedPassword) return res.status(400).json({"status": "faild", "message" : "password or email is wrong"});
            const token = generateToken(checkEmailId.userId, res)
            
            return res.status(200).json({
                "status": "sucessfull",
                "message": "logged in sucessfully",
                "user" : checkEmailId,
                
            })
        
        }



        

        
    } catch (error:any) {
        res.status(400).json({
            "status" : "login failed",
            "message" : error.message

        })
    }
    

    
}



const logOut = (req: Request, res: Response)=>{
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date()
    });

    res.status(200).json({
        status: "success",
        message: "loggedout sucessfully"
    });
}





export {registerUser, loginUser, logOut}