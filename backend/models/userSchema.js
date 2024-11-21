import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail,"Please Provide Valide Mail"]
    },
    phone:{
        type: String,
        required: true,
    },
   nic:{
        type: String,
        required: true,
        minlength: [5, "NID number contain 5 digit"]
    },
    dob:{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        enum: ["Male","Female"]
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String,
        required: true,
        enum:["Patient","Doctor","Admin"]
    },
    doctorDepartment:{
        type: String
    },
    docAvatar:{
        public_id: String,
        url: String
    }

});
userSchema.pre('save',async function(next){
    const person = this;
    if (!person.isModified('password')) {
        console.log("no encrypt")
        next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(person.password, salt);
        person.password = hashPassword;
        console.log("encrypt block")
        next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword,this.password)
        //const isMatch = candidatePassword===this.password? true:false
        //console.log(isMatch,candidatePassword,this.password)
        return isMatch;
    } catch (error) {
        throw(error)
    }
}
userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES
    })
}

export const User = mongoose.model("User",userSchema);