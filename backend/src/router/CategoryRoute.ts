import { Router } from "express";
const router=Router()
import multer from "multer"
import {addcategory,updatecategory,getcategory,deletecategory} from "../controleur/CategoryControllers"
const storage=multer.diskStorage({
    destination:(req:any,file:any,cb:any)=>{
cb(null,'uploads')
    },
    filename:(req:any,file:any,cb:any)=>{
        cb(null,Date.now()+'_'+file.originalname)
    }
})
const upload =multer({storage})
router.post("/addcategory",upload.single('image'),addcategory)
router.put("/updatecategory/:id",upload.single('image'),updatecategory)
router.get("/getcategory",getcategory)
router.delete("/deletecategory/:id",deletecategory)
export default router