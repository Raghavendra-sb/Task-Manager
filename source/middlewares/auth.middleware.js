import {ApiError} from "../utils/ApiError"
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import {User} from "../models/user.model"

export const verifyJWT = asyncHandler(async (req,res,next)=>
{
    try {
          const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
          if(!token)
            {
                throw new ApiError(401,"User is not authenticated")
            }
            const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
         
             if(!user)
             {
                  throw new ApiError(404,"Invalid Access token")
             }   
                req.user = user
         
                  next()

        
    } catch (error) {
        throw new ApiError(404,"User not authenticated")
    }
})