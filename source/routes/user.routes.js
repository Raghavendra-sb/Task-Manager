import { Router } from "express";
import {refreshToken }from "../controllers/user.controller.js";
import {registerUser} from "../controllers/user.controller.js"


const router = Router();

router.route("/register").post(registerUser);

export default router;