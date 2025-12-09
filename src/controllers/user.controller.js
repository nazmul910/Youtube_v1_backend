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
   
   let coverImageLocalPath;

   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path;;
   }


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
        200,
        createdUser,
        "User registered successfully",
    )
   )





});

const loginUser = asyncHandler(async (req,res) =>{
    const {email,userName,password} = req.body;

    if(!email || !userName){
        throw new ApiError(400,"Email or Username is required");
    }

    const user = await User.findOne({
        $or:[{email}, {userName}]
    })

    if(!user){
        throw new ApiError(404,"User not found");
    };

    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials");
    };


    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInuser = await User.findById(user._id).select("-password -refreshToken");


    const option = {
        httpOnly:true,
        secure:true
    }

    return res
      .status(200)
      .cookie("accessToken",accessToken,option)
      .cookie("refreshToken",refreshToken,option)
      .json(
        new ApiResponse(
            200,
            {
                user:loggedInuser,
                accessToken,
                refreshToken
            },
            "User logged in successfully",
        )
      );





    
});

const logoutUser = asyncHandler(async (req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly:true,
        secure:true
    };

    return res
        .status(200)
        .clearCookie("accessToken",option)
        .clearCookie("refreshToken",option)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
})


export {
    registerUser,
    loginUser,
    logoutUser

}; 