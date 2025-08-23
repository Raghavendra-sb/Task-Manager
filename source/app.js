import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({//used for parsing the json data in the request body
    limit:"17kb"
}))

app.use(express.urlencoded({//used for parsing the url encoded data in the request body.which means the form data
    //which is sent from the client side to the server side
    extended:true,
    limit:"17kb"
}))

app.use(cookieParser());

import router from "./routes/user.routes.js";
app.use("/api/v2/users",router)//using the user routes



export default app;