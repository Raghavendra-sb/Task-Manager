import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title:
        {
            type:String,
            required:true
        },
        description:
        {
            type:String,
            required:true
        },
        status:
        {
            type:String,
            enum:["pending","in-progress","completed"],
            default:"pending"
        },
        user:
         {   //type:Schema.Types.ObjectId,
        //     ref:"User",
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            username: { type: String, required: true }
            

        }
    }
    ,{timestamps:true})

export const Task =  mongoose.model("Task",taskSchema);