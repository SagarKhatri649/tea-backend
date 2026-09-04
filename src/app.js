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
 
 
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
 
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
 import commentRouter from "./routes/comment.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

import healthcheckRouter from "./routes/healthcheck.routes.js"
// routes declaration

app.use("/api/v1/users",userRouter)     //Mount at /api/v1/users


 
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
 
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
 
app.use("/api/v1/comments", commentRouter)

app.use("/api/v1/dashboard", dashboardRouter)


app.use("/api/v1/healthcheck", healthcheckRouter)
//ex- http://localhost:8000/api/v1/user/register

 


export {app}