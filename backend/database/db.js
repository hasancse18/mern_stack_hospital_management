import mongoose  from "mongoose";
export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName: "hospital_management"
    }).then(()=>{
        console.log("Databse connected")
    }).catch((err)=>{
        console.log(`Erro Occured ${err}`)
    })
}