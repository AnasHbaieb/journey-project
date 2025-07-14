import { Router } from "express";
const router=Router()
import multer from "multer"
import {addarticle,updateArticle,getallarticle,getarticlebycategory,getarticlebyuser,getarticlebyid,deletearticle} from "../controleur/Articlecontrolleur"
const storage=multer.diskStorage({
    destination:(req:any,file:any,cb:any)=>{
cb(null,'uploads')
    },
    filename:(req:any,file:any,cb:any)=>{
        cb(null,Date.now()+'_'+file.originalname)
    }
})
const upload =multer({storage})
router.post("/addarticle",upload.single('image'),addarticle)
router.put("/updatearticle/:id",upload.single('image'),updateArticle)
router.get("/getallarticle",getallarticle)
router.get("/getarticlebycategory/:id",getarticlebycategory)
router.get("/getarticlebyuser/:id",getarticlebyuser)
router.get("/getarticlebyid/:id",getarticlebyid)    
router.delete("/deletearticle/:id",deletearticle)
export default router