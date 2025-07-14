import { Router } from "express";
const router=Router()
import {addfavorite,getfavorite,deletefavorite} from "../controleur/favoritecontrolleur"

router.post("/addfavorite",addfavorite)
router.get("/getfavorite/:id",getfavorite)
router.delete("/deletefavorite/:id",deletefavorite)
export default router
