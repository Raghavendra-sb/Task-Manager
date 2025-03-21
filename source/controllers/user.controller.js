import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
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
    json(new ApiResponse(200,{user:loginUser,accessToken,refreshToken},"User logged in successfully"))

})


export {registerUser}
export {generateAccessTokenandRefreshToken}
export{loginUser}

