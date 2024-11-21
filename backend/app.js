import express from "express";
import {config} from "dotenv"
config({path:'./config/config.env'})
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/db.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import usersRouter  from "./router/userRouter.js";
import routerAppointment from "./router/appointmentRouter.js";
const app = express()
 
//middleware//
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}))
//cookie parser middleware
app.use(cookieParser());
//json data convert to string middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//file import middleware
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/temp/"
}))

app.use('/api/v1/message',messageRouter);
app.use('/api/v1/user',usersRouter)
app.use('/api/v1/appointment',routerAppointment)
app.use('/',(req,res)=>{
   return res.status(200).json({
        success:true,
        message: "You are on"
    })
})


dbConnection()
app.use(errorMiddleware)
export default app;