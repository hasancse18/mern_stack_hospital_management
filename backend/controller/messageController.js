import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import {Message} from "../models/messageSchema.js"
import ErrorHandler from "../middleware/errorMiddleware.js";

export const sendMessage = catchAsyncErrors(async(req,res,next)=>{
    const {firstName, lastName, email, phone, message} = req.body;
    if(!firstName || !lastName || !email || !phone || !message){
        return next(new ErrorHandler("Please Fill Full Form",400))
    }
    // const messageData = new Message(req.body);
    // const response = await messageData.save();
    await Message.create({firstName, lastName, email, phone, message})
    res.status(200).json({
        success: true,
        message: "Message Send Successfully"
    })
})

export const getAllMessage = catchAsyncErrors(async(req,res,next)=>{
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages
    })
})