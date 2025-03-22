import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken";
import mongoose  from "mongoose";
import { Task } from "../models/task.model.js";

const generateAccessTokenandRefreshToken = async function (id){
    const user = await User.findById(id);
    if(!user)
    {
        throw new ApiError(404,"User not found in the database");
    }
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
   await user.save({ValidateBeforeSave: false});
   return {accessToken,refreshToken};
}

const registerUser = asyncHandler(async function (req,res) {
    const { username,password}= req.body;

    if(!username)
    {
        throw new ApiError();
    }
    if(!password)
        {
            throw new ApiError(400,"please enter the password");
        }

    const existedUser = await User.findOne(
       {
        $or:[{username},{password}]
       }
    ) 
    if(existedUser)
        throw new ApiError(409 ,"User Already exists");

    const user = await User.create(
        {
            username:username.toLowerCase(),
            password
        }
    )

    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    if(!userCreated)
    {
        throw new ApiError(500,"User creatation failed");
    }

    return res.status(201).json(
        new ApiResponse(201,userCreated,"User registered successfully")
    )
})

const loginUser = asyncHandler(async function (req,res)
{
    const {username,password}=req.body;

    if(!username)
    {
        throw new ApiError(400,"please enter the username")
    }
    if(!password)
    {
        throw new ApiError(400,"please enter the password")
    }

    const user = await User.findOne(
      {
        $or:[{username},{password}]
      }
       // $or({username},{password})
    )

    if(!user)
    {
        throw new ApiError(404,"User not found");
    }

    const isPasswordvalid = await user.isPasswordCorrect(password)

    if(!isPasswordvalid)
    {
        throw new ApiError(401,"Incorrect Password");
    }

    const {accessToken,refreshToken}= await generateAccessTokenandRefreshToken(user._id);

    const logedInUser = await User.findOne(user._id).select("-password -refreshToken");
    
    const options = 
    {
        httpOnly:true,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production (HTTPS)
        sameSite: "strict", 
    }

    res.status(200).
    cookie("accessToken",accessToken,options).
    cookie("refreshToken",refreshToken,options).
    json(new ApiResponse(200,{user:logedInUser,accessToken,refreshToken},"User logged in successfully"))

})

const logoutUser = asyncHandler(async function (req,res){
   await User.findByIdAndUpdate(req.user._id ,
    {
        $set : {
            refreshToken:"",
        }
    },
        {
            new:true,
        }
   )

   const options =
   {
      httpOnly:true,
       secure: process.env.NODE_ENV === "production" ? true : false,
       sameSite: "strict"
   }

   res.status(200).
   clearCookie("accessToken",options).
   clearCookie("refreshToken",options).
   json(new ApiResponse(200, {}, "User logged out successfully"));

})

const createTask = asyncHandler(async function(req, res){
    const {title,description,status} = req.body;
    if (!req.user || !req.user._id || !req.user.username) {
        throw new ApiError(401, "User information is missing. Please log in again.");
    } 
   

    const task = await Task.create(
        {
            title,
            description,
            status,
            user: {
                _id: req.user._id,
                username: req.user.username // Store username inside the task
            }
        }
    )
   
    const taskCreated = await Task.findById(task._id);
    if(!taskCreated)
    {
        throw new ApiError(500,"Task creation failed");
    }

    return res.status(201).
    json(new ApiResponse(201,taskCreated,"Task created successfully"));

})

const getTask = asyncHandler(async function(req,res){

    const task = await Task.findById(req.user._id);
    if(!task)
    {
        new ApiError(500,"User Task not found");
    }
    return res.status(201).json(new ApiResponse(201,task,"Tasks fetched successfully"));
})

export {registerUser}
export {generateAccessTokenandRefreshToken}
export{loginUser}
export {logoutUser}
export {createTask}
export {getTask}
