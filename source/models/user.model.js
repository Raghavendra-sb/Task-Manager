import mongoose  from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROLES } from "../constants.js";

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

          },
          role:
          {
           type:String,
           required : true
          }

    }
     ,{timestamps:true})



//what is "save" here? "save" is a mongoose middleware which is used to perform some action before saving the document to the database


userSchema.pre("save", async function(next)//this is a mongoose middleware which is used to hash the password before saving it to the database
{
     //if(this.isModified(this.password)) return next();
     //this.password is the password field in the userSchema
     //if the password is not modified then we don't need to hash it again
     if (!this.isModified("password")) return next();

     this.password = await bcrypt.hash(this.password,10);
     return next();
});

userSchema.methods.isPasswordCorrect = async function (password) {//userdefined method to check if the password is correct
    //this.password is the hashed password stored in the database
    //password is the password entered by the user
    //bcrypt.compare is used to compare the two passwords
     return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAcessToken = function()//jwt.sign(payload, secret, options)
{
  return jwt.sign(
   {
    _id:this._id,//why _id? because in the userSchema we have _id as the primary key , is _id predefined in mongoose? 
    username:this._username
   },
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY 
   }

  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id:this._id,

      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY 
      }
  )
}

export const User = mongoose.model("User",userSchema);