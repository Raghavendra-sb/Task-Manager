import { Router } from "express";

import {registerUser,logoutUser,createTask} from "../controllers/user.controller.js"
import { loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser) 
router.route("/createTask").post(verifyJWT,createTask)

export default router;