import { Router } from "express";

import {registerUser,logoutUser,createTask,getTask, updateTask,deleteTask} from "../controllers/user.controller.js"
import { loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser) 
router.route("/createtask").post(verifyJWT,createTask)
router.route("/gettask").post(verifyJWT,getTask)
router.route("/updatetask/:taskId").patch(verifyJWT,updateTask)
router.route("/deletetask/:taskId").delete(verifyJWT,deleteTask)
router.route("/:id").delete(verifyJWT,verifyUser("admin"),deleteTask);
export default router;