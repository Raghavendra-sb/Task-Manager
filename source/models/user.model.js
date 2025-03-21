import mongoose  from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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





userSchema.pre("save", async function(next)
{
     if(this.isModified(this.password)) return next();
     this.password = await bcrypt.hash(this.password,10);
     return next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
     return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAcessToken = function()
{
  return jwt.sign(
   {
    _id:this._id,
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