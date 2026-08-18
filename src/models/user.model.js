//part - 9 user model



import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import  JsonWebTokenError  from "jsonwebtoken";
const userSchema = new Schema (
  {

    username: {

      type: String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      index:true
    },
    email: {

      type: String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      
    },
    fullName: {

      type: String,
      required:true,
      trim:true,
      index:true
      
    },
    avator:{
      type: String, // cloudinary url
      required:true,
    },
    coverImage:{
      tpye: String, // cloudinary url
    },
    watchHistory:{
      type: Schema.Types.ObjectId,
      ref:"Video"
    },
    password: {
      type: String,
      required:[true, 'password is required']
    },
    refreshToken:{
      type: String,
    }
    
}
,{
  timestamps:true
})

//part - 9.2 bcrypt and jwt  (Password Hashing)

//Password Hashing (Before Save)
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password,10);
   next()
  
})

//Compare Password
userSchema.methods.isPasswordCorrect = async function (password) {

  return await bcrypt.compare(password,this.password) 
}


//Generate Access Token
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      email:this.email,
      username:this.username,
      fullName: this.fullName
      
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


//Generate Refresh Token
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}
export const User = mongoose.model("User" ,userSchema)

// Access token: Contains full user data
// Refresh token: Only contains ID

// Why? Refresh token is sent less frequently
// Less chance of being stolen
// Contains minimal data even if stolen

/**
 

1. User Login
   ├─ Check password ✅
   ├─ Generate access token (15 min)
   ├─ Generate refresh token (7 days)
   └─ Send both to frontend

2. Frontend Usage
   ├─ Access token → Stored in memory/localStorage
   ├─ Refresh token → Stored in httpOnly cookie (secure)
   └─ Send access token with EVERY request

3. Access Token Expires
   ├─ Frontend: "Token expired!"
   ├─ Frontend sends refresh token to backend
   ├─ Backend verifies refresh token
   ├─ Backend generates NEW access token
   └─ Frontend continues using new token

4. Refresh Token Expires
   ├─ Both tokens invalid
   └─ User must login again
 */