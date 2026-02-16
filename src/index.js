// require('dotenv').config({path: '.env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants";

 
dotenv.config({

  path: '.env'
})
// use experiment version in dev : "dev: "nodemone - r dotenv/config --experimental-json-modules src/index.js"


connectDB()








//Connect Database type 1 in index.js file 
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