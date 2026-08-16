 
 //part 6- utility Api error
 
 
 //**This file is for error handling ,define errors for our app
 // This is to handle errors 
 // this is api error hanndle file*/
 
 
 
 class APiError extends Error{

  constructor(
    statusCode,
    message= "Something went wrong",
    errors = [],
    statck = "", //error stack
  ){

    super(message) //overwrite
    this.statusCode = statusCode //overwrite
    this.data = null
    this.message  = message
    this.success = false;
    this.errors = errors


    //This is just for production grade code
    if(statck){
      this.stack =statck
    }else{

      Error.captureStackTrace(this,this.constructor)
    }
  }
 }
 export default APiError;