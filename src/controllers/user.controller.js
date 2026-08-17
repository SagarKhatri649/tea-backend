

//part -13  controller : functionality

import {asyncHandler}  from "../utils/asyncHandler.js";
import APiError from "../utils/ApiError.js"
import  {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
 

//part -17

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
//part -15   register controller : functionality

const registerUser = asyncHandler(async (req,res) =>{
 
  // get user details from frontend
  //validation - not empty
  //check if user already exists: username ,email
  //check for images,check for avator
  //upload them to cloudinary ,avator
  //create user object - create entry in ndb
  //remove password  and refresh token field from response
  //check for user   creation
  //return res


  //1 Extract form fields sent by frontend
  const {fullName,email,username,password} = req.body 

  console.log("email :",email);

  //2 Validate Not Empty
  if( [
    fullName,email,username,password].some((field) => field?.trim() === "")) {

      throw new ApiError(400,"All fields are required")
    }
  
    //3 Check User Exists
  const existedUser = User.findOne({
    $or: [{username},{email}]
  })

  if(existedUser){
    throw new ApiError(409,"user with email or username already exists")
  }


  //4 Get File Paths
  const avatorLocaPath = req.files?.avator[0]?.path;
  
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatorLocaPath){
    throw new ApiError(400,"Avator file is required")
  }


  //5 Upload to Cloudinary
  const avator =  await uploadOnCloudinary(avatorLocaPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avator){

    throw new ApiError(400,"Avator file is required")
  }
 
  // 6 CREATE user in DB
  const user = await User.create({

    fullName,
    avator:avator.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })
 
  // 7 Remove Sensitive Fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
  }

   // 8 Return Response
  return res.status(201).json(

    new ApiResponse(200,createdUser," User registered Successfully")
  )

})
//part -16

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie



    // 1 Get Credentials
    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }


    //2 Find User
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }


    // 3 Verify Password
    //What: Compare entered password with hashed password
   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }


    // 4 Generate Tokens
   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)


   // 5 Get User Data
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    //6 Set Cookies
    const options = {
        httpOnly: true,  // Can't access from JavaScript
        secure: true // HTTPS only (production)
    }
 
    // 7 Send Response
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

//part -18
//Invalidate tokens and end user session
const logoutUser = asyncHandler(async(req, res) => {

  //1 Remove Token from DB
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { //// $unset: Remove field entirely

                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
  // 2   Clear Cookies
    const options = {
        httpOnly: true,
        secure: true
    }


    // 3 Send Response
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


//part 20

//When access token expires, use refresh token to get a new one
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})
export {registerUser,
   loginUser,
    logoutUser,
    refreshAccessToken,

} 

//generateAccessAndRefereshTokens() = Generate both
//refreshAccessToken = Keep user logged in without re-entering password



// 21 - controler:Change current password
const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

// 22 Contorller: Get Current User
const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

// 23  Controller : Update Account Details 


const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});
