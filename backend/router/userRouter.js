import express from "express";
import { addNewAdmin, getAllDoctor, login, logOutAdmin, logoutPatient, patientRegister, userDetails,addNewDoctor  } from "../controller/userController.js";
import { User } from "../models/userSchema.js";
const usersRouter = express.Router();
import{isAdminAuthenticated, isPatientAuthenticated} from "../middleware/auth.js"

usersRouter.post('/signup',patientRegister);
usersRouter.post('/login',login)
usersRouter.post('/admin/addnew',isAdminAuthenticated,addNewAdmin)
usersRouter.get('/doctors',getAllDoctor)
usersRouter.get('/admin/me',isAdminAuthenticated,userDetails)
usersRouter.get('/user/me',isPatientAuthenticated,userDetails)
usersRouter.get('/admin/logout',isAdminAuthenticated,logOutAdmin)
usersRouter.get('/patient/logout',isPatientAuthenticated,logoutPatient)
//add doctor
usersRouter.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
usersRouter.get('/get',async(req,res)=>{
    const response = await User.find();
    console.log("Data fetched");
    res.status(200).json(response);
})
export default usersRouter;