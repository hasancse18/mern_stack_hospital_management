import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken"
export const isAdminAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const token = req.cookies.adminToken;
    if(!token){
        return next(new ErrorHandler("Admin is Not Authenticated",400));
    }
    //Authentication
    //console.log(token)
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    //console.log(decoded)
    req.user = await User.findById(decoded.id);
    //console.log(req)
    //Authorization
    if(req.user.role!=="Admin"){
        return next(new ErrorHandler(`${req.user.role} not authorized for this resources`,403))
    }
    next();
})

export const isPatientAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const token = req.cookies.patientToken;
    if(!token){
        return next(new ErrorHandler("Patient is Not Authenticated",400));
    }
    //Authentication
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    //Authorization
    if(req.user.role!=="Patient"){
        return next(new ErrorHandler(`${req.user.role} not authorized for this resources`,403))
    }
    next();
})