import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary"
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password,role } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role:"Patient"
  });
  console.log("Data Saved");
  generateToken(user,"Signup Success",200,res)
  // res.status(200).json({
  //   success: true,
  //   message: "Signup Success"
  // })
});

export const login = catchAsyncErrors(async(req,res,next)=>{
  const {email, password,confirmPassword, role} = req.body;
  if(!email|| !password|| !role)
  {
    return next(new ErrorHandler("Please Provide All Details",400))
  }
  if(password!= confirmPassword){
    return next(new ErrorHandler("Password Not Matched",400))
  }
  const user = await User.findOne({email}).select("+password");
  //console.log(user);
  if(!user){
    return next(new ErrorHandler("Password Incorrect",400))
  }
  const isMatched = await user.comparePassword(password)
  if(!isMatched)
  {
    return next(new ErrorHandler("Invalid Password Incorrect",400))
  }
  if(role !==user.role){
    //console.log(role, user.role);
    return next(new ErrorHandler("User with ROle Not Found",400))
  }
  generateToken(user,"Login Successfully",200,res)
  // res.status(200).json({
  //   success:true,
  //   message: "User Login"
  // })
})


export const addNewAdmin = catchAsyncErrors(async (req,res,next)=>{
  const { firstName, lastName, email, phone, nic, dob, gender, password} =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const findeOne = await User.findOne({email})
  if(findeOne){
    return next(new ErrorHandler("Email is already registered",400))
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role:"Admin"
  });
  generateToken(user,"Admin Signup Success",200,res)
})

export const getAllDoctor = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  console.log("Data Fetched")
  //console.log(doctors);
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const userDetails = catchAsyncErrors(async(req,res,next)=>{
  const user = req.user
  res.status(200).json({
    user,
    success:true
  })
})

export const logOutAdmin = catchAsyncErrors(async(req,res,next)=>{
  res.status(200)
  .cookie("adminToken","",{
    httpOnly: true,
    expires: new Date(Date.now())
  })
  .json({
    success: true,
    message: "Admin log out Successfully"
  })
})

export const logoutPatient = catchAsyncErrors(async(req,res,next)=>{
  res.status(200)
  .cookie("patientToken","",{
    httpOnly: true,
    expires: new Date(Date.now())
  })
  .json({
    success: true,
    message: "Patient log out Successfully"
  })
})

//add doctor
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});
