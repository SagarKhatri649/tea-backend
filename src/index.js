
// require('dotenv').config({path: '.env'})


//part -4  database improved version (approached 3)


import dotenv from "dotenv"
import connectDB from "./db/index.js";
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants";
import { app } from "./app.js"

 
dotenv.config({ // Load environment variables from .env file first

  path: '.env'
})
// use experiment version in dev : "dev: "nodemone - r dotenv/config --experimental-json-modules src/index.js"


connectDB()
  .then(() =>{

    app.listen(process.env.PORT || 8000,() =>{
      console.log(`Server is running at Port:${process.env.PORT}`);
    })
  })
  .catch((err) =>{
    console.log("MONGO db connection failed !!! ",err);
  })





//part -2 database connect 

//Connect Database approach  1 in index.js file 
/*
import express from "express"
const app = express()

(async() =>{

  try{
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

      app.on("error",(error) =>{
        console.log("ERRR:",error);
        throw error
      })

      app.listen(process.env.PORT,() =>{
        console.log(`App is listenting on port ${process.env.PORT}`);
      })

  }
  catch(error){
    console.error("ERROR:",error)
    throw err
    
  }
})
*/