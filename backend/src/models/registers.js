const mongoose = require("mongoose");
const employeeschema = new mongoose.Schema({
    username :{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    age :{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const Register = new mongoose.model("Register",employeeschema);
module.exports=Register; // Collection [ Tables]  : JSON 
