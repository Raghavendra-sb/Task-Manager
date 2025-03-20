import mongoose  from "mongoose";

const userSchema = new mongoose.Schema(
    {
          username:
          {
            type:String,
            required:true,
            unique:true,
            trim:true
          },
          password:
          {
            type:String,
            required:[true, "Password is required"],
            minlength:6
          },
          refreshToken:
          {
            type:String,
            default:null

          }
    }
     ,{timestamps:true})


     export const User = mongoose.model("User",userSchema);