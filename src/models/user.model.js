import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,   // hepling for searchin optimization it use true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
})


userSchema.methods.isPasswordMatched = async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRES
    }
)
} 

userSchema.method.generateAccessToken = function() {
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRES
    }
)
}

export const User = mongoose.model("User",userSchema);