import {Request, Response} from 'express'
import {  PrismaClient, Prisma } from '@prisma/client'
import  * as dotenv from 'dotenv'
dotenv.config()
const prisma =new PrismaClient()

export const addarticle=async(req:Request,res:Response):Promise<any>=>{
    try {
        console.log("Received request body:", req.body);
        const {title,slug,contenu,langue,summary,published,publishedAt,userId,categoryId}=req.body
       
                let imageUrl = '';
                if (req.file) {
                    imageUrl = 'http://localhost:5920/' + req.file.path;
                }
                let pub=Boolean(published)
        
     
        const finalSlug = (slug === '' || slug === undefined) ? null : slug;

        await prisma.article.create({
            data:{
                title,
                slug: finalSlug,
                contenu,
                langue,
                image: imageUrl,
                summary,
                published:pub,
                publishedAt,
                userId: parseInt(userId),
                categoryId: parseInt(categoryId)
            }
        })
        
        return res.status(200).json({message:"new article added"})
   //lasemni nfhemha
    } catch (error: any) {
        console.error("Error in addarticle:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002' && (error.meta as any)?.target?.includes('slug')) {
            return res.status(409).json({message: "Slug already exists. Please choose a different one or leave it empty.", error: error.message});
        } else {
            res.status(500).json({message: "An unexpected error occurred.", error: error.message});
        }
    }
}
export const updateArticle=async(req:Request,res:Response):Promise<any>=>{
    try {
        const {title,slug,contenu,langue,summary,published,publishedAt,userId,categoryId}=req.body
       
        let imageUrl = '';
        if (req.file) {
            imageUrl = 'http://localhost:5920/' + req.file.path;
        }
        await prisma.article.update({
            where:{id:parseInt(req.params.id)},
            data:{
                title,
                slug,
                contenu,
                langue,
                image: imageUrl,
                summary,
                published:Boolean(published),
                publishedAt,
                userId: parseInt(userId),
                categoryId: parseInt(categoryId)
            }
        })
        return res.status(200).json({message:"article updated with success"})
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const getallarticle=async(req:Request,res:Response):Promise<any>=>{
    try {
        const article=await prisma.article.findMany({
            include:{
                user:{
                    select:{
                        id:true,
                        firstname:true,
                        lastname:true,
                    }
                },
                category:{
                    select:{
                        id:true,
                        name:true,
                    }
                }
            }
        })
        return res.status(200).json(article)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const getarticlebycategory=async(req:Request,res:Response):Promise<any>=>{
    try {


        const article=await prisma.article.findMany({
            where:{
                categoryId:parseInt(req.params.id)
            },
            include:{
                user:{
                    select:{
                        id:true,
                        firstname:true,
                        lastname:true,
                        email:true,
                    }
                },
                category:{
                    select:{
                        id:true,
                        name:true,
                    }
                }
            }
        })
        return res.status(200).json(article)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const getarticlebyuser=async(req:Request,res:Response):Promise<any>=>{
    try {
        const article=await prisma.article.findMany({
            where:{
                userId:parseInt(req.params.id)
            },
            include:{
                user:{
                    select:{
                        id:true,
                        firstname:true,
                        lastname:true,
                        email:true,
                    }
                },
                category:{
                    select:{
                        id:true,
                        name:true,
                    }
                }
                }
        })
        return res.status(200).json(article)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const getarticlebyid=async(req:Request,res:Response):Promise<any>=>{
    try {
        const article=await prisma.article.findUnique({
            where:{id:parseInt(req.params.id)},
            include:{
                user:{
                    select:{
                        id:true,
                        firstname:true,
                        lastname:true,
                        email:true,
                    }
                },
                category:{
                    select:{
                        id:true,
                        name:true,
                        descreption:true,
                    }
                }
            }
        })
        return res.status(200).json(article)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
export const deletearticle=async(req:Request,res:Response):Promise<any>=>{
    try {
        await prisma.article.delete({
            where:{id:parseInt(req.params.id)}
        })
        return res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        console.error("Error deleting article:", error);
        return res.status(500).json({ error: "Failed to delete article" });
    }
}