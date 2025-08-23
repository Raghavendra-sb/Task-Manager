import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req,res,next)=>
{
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
        //  const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
          if(!token)
            {
                throw new ApiError(401,"User is not authenticated")
            }
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          //  const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken role")
         
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

export const verifyUser = (...allowedRoles) => asyncHandler(async (req,res,next)=>{
 
  if( !req.user || !allowedRoles.includes(req.user.role))
  {
      throw new ApiError(403,"User not authenticated")
  }
  next();

})


