//part -5 express app
//midddleware setup

import express from "express"
import cors from "cors"

import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))

//configurations 

app.use(express.json({limit: "16kb"}))  //jab form se data aaya
app.use(express.urlencoded({extended:true,limit: "16kb"}))  // jaba data url se aaya ,extende means - nested object

app.use(express.static("public")) // job kuch file,pdf save krna ha 

app.use(cookieParser())//server se user k browser ki cooki access kr paau or set kr paau



//part- 14
// routes import

import userRouter from './routes/user.routes.js' //Import user routes


// routes declaration

app.use("/api/v1/users",userRouter)     //Mount at /api/v1/users

//ex- http://localhost:8000/api/v1/user/register

 


export {app}