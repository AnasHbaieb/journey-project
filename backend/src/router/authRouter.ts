import { Router } from "express";
const router=Router()
import {signup,login,verfiycompte,getUserById,updateUser} from "../controleur/authcontroleur"

router.post("/signin",login)
router.post("/signup",signup)
router.put("/verify",verfiycompte)
router.put("/updateuser/:id",updateUser)
router.get("/getuserbyid/:id", getUserById)
export default router
