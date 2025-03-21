import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose  from "mongoose";

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
        throw new ApiError(400,"please enter the username");
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

export {registerUser}

