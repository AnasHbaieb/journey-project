import {Request, Response} from 'express'
import { PrismaClient } from '@prisma/client'
import  * as dotenv from 'dotenv'
dotenv.config()
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma =new PrismaClient()
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"anashbaieb@gmail.com",
        pass:"fonk ezvy kndf corl"
    },
    tls:{
      rejectUnauthorized:false
    }
})
export const signup=async(req:Request,res:Response):Promise<any>=>{
    try {
        const {firstname,lastname,email,password}=req.body
        console.log(firstname,lastname,email,password);
        
        const userexist=await prisma.user.findUnique({where:{email}})
        if (userexist){
            return res.status(400).json({message :"user already exist"})
        }else{
            const salt = await bcrypt.genSalt(10)
            const hashedPassword= await bcrypt.hash(password,salt)
            const result= await prisma.user.create({data:{firstname,lastname,email,password:hashedPassword},})
            res.status(200).json({resultat:result})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }    
}
export const login=async(req:Request,res:Response):Promise<any>=>{
    try {
        const existemail = (req.body.email.toLowerCase()).trim()
        const existeuser=await prisma.user.findUnique({where:{email:existemail}})  
        if (!existeuser) {
            return res.status(401).json("Check your email or password");
        }
        else{
            const providedPassword = req.body.password;
            const passwordValid = await bcrypt.compare(providedPassword,existeuser.password);
            if (!passwordValid) {
                return res.status(401).json("Check your email or password");
            } else if(existeuser.active==false){
              
               
                    const codeverif=Math.floor(Math.random()*(9999-1000)+1000)
                    transporter.sendMail({
                        from:"Anas Hbaieb",
                        to:existemail,
                        subject:"mail confirmation",
                        text:`bonjour ${existeuser.firstname } ${existeuser.lastname} votre code de validation est ${codeverif}`
                    },async(error)=>{
                        if (error) {
                            console.log(error);
                            
                            return res.status(401).json(error)
                        }else{
                            await prisma.user.update ({where:{id:existeuser.id},
                                data: {codeVerfication:codeverif}})
                            return res.status(201).json({message:"email d'activation envoyer avec succes"})
                            
                        }
                    }

                    )
                
            }
            else{
                const token=jwt.sign({id:existeuser.id},process.env.secretkey as string,{expiresIn:"2d"})
                 return res.status(200).json({token:token,utilistauer:{id:existeuser.id,firstname:existeuser.firstname,lastname:existeuser.lastname,email:existeuser.email}})
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error)     
    }
}


export const verfiycompte=async(req:Request,res:Response):Promise<any>=>{
    try {
        const {codeverif} = req.body;
    const existeuser=await prisma.user.findFirst({where:{codeVerfication: codeverif}})
      
            if (!existeuser) {
                return res.status(400).json({message:"Invalid user avec code."});
            }
else{
            await prisma.user.update({
                where:{id:existeuser.id},
                data:{
                    active:true,
                    codeVerfication:null
                }
            });

            const token=jwt.sign({id:existeuser.id},process.env.secretkey as string,{expiresIn:"2d"});
            return res.status(200).json({token:token,utilistauer:{id:existeuser.id,firstname:existeuser.firstname,lastname:existeuser.lastname,email:existeuser.email}});
        }
    } catch (error) {
        
    }
}

export const getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                descreption: true,
                intrest: true,
                adresse: true,
                imageUrl: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, descreption, intrest, adresse, imageUrl } = req.body;

        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                firstname,
                lastname,
                email,
                descreption,
                intrest,
                adresse,
                imageUrl,
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                descreption: true,
                intrest: true,
                adresse: true,
                imageUrl: true,
                createdAt: true,
            }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
