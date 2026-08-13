import mongoose from "mongoose";

const Auth=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    uid:{
        type:String,
        required:true
    },
    photoURL:{
        type:String
    }
},{
    timestamps:true
})
const auth=mongoose.model("auth",Auth)
export default auth