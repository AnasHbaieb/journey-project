import {Request, Response} from 'express'
import {  PrismaClient } from '@prisma/client'
import  * as dotenv from 'dotenv'
dotenv.config()
const prisma =new PrismaClient()

export const addfavorite=async(req:Request,res:Response):Promise<any>=>{
    try {
        const {userId,articleId}=req.body
        const newFavorite = await prisma.favorite.create({
            data:{
                userId,
                articleId,
            
            }
        })
        return res.status(200).json(newFavorite)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const getfavorite=async(req:Request,res:Response):Promise<any>=>{
    try {
        console.log('Fetching favorites for userId:', req.params.id);
        const favorite=await prisma.favorite.findMany({
            where:{
                userId:parseInt(req.params.id)
            },
            include:{
                article:{
                    select:{
                        id:true,
                        userId:true,
                        title:true,
                        slug:true,
                        contenu:true,
                        langue:true,
                        image:true,
                        summary:true,
                        published:true,
                        publishedAt:true,
                        user:{
                          select:{
                            id:true,
                            firstname:true,
                            lastname:true
                          }
                        }
                    }
                }
            }
        })
        console.log('Prisma findMany result:', favorite);
        return res.status(200).json(favorite)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const deletefavorite=async(req:Request,res:Response):Promise<any>=>{
    try {
        await prisma.favorite.delete({
            where:{id:parseInt(req.params.id)}
        })
        return res.status(200).json({message:"favorite deleted avec succes"})
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
