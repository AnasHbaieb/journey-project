import {Request, Response} from 'express'
import {  PrismaClient } from '@prisma/client'
import  * as dotenv from 'dotenv'
dotenv.config()
const prisma =new PrismaClient()

export const addcategory=async(req:Request,res:Response):Promise<any>=>{
    try {
        const {name,descreption}=req.body
       
                let imageUrl = '';
                if (req.file) {
                    imageUrl = 'http://localhost:5920/' + req.file.path;
                }
                console.log(imageUrl);
                
                
        await prisma.category.create({
            data:{
                name,
                descreption,
                imageUrl
            }
        })
        
        return res.status(200).json({message:"new category"})
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const updatecategory=async(req:Request,res:Response):Promise<any>=>{
    try {
        const {name,descreption}=req.body
       
        let imageUrl = '';
        if (req.file) {
            imageUrl = 'http://localhost:5920/' + req.file.path;
        }
        await prisma.category.update({
            where:{id:parseInt(req.params.id)},
            data:{
                name,
                descreption,
                imageUrl
            }
        })
        return res.status(200).json({message:"category updated avec succes"})
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const getcategory=async(req:Request,res:Response):Promise<any>=>{
    try {
        const category=await prisma.category.findMany()
        return res.status(200).json(category)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const deletecategory=async(req:Request,res:Response):Promise<any>=>{
    try {
        await prisma.category.delete({
            where:{id:parseInt(req.params.id)}
        })
        return res.status(200).json({message:"category deleted avec succes"})
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}