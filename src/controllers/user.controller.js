import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const registerUser = asyncHandler(async (req,res) =>{
   const {email,fullName,userName,password} = req.body;
   
   if(!email || !fullName || !userName || !password){
    throw new ApiError(400,"All fields are required");
   } 

   const existingUser = await User.findOne({
        $or: [{ email },{ userName }]
    });

    if(existingUser){
        throw new ApiError(409,"User already exists");
    }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;


   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required");
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
      throw new ApiError(500,"Avatar is required");
   }

   const user = await User.create({
       fullName,
       userName:userName.toLowerCase(),
       email,
       password,
       avatar:avatar.url,
       coverImage:coverImage?.url || ""
   })

   const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser){
    throw new ApiError(500,"User ragistering failed");
   }


   return res.status(201).json(
    new ApiResponse(
        201,
        createdUser,
        "User registered successfully",
    )
   )





});

export {registerUser}; 