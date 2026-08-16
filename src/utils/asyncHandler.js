//part -6 utility async handler



//** This is wrapper function which we will use multiple times - it just make easy for developer*/



//const asyncHandler = () =>{}
// const asyncHandler = (func) => () =>{}
// const asyncHandler = (func) =>async () =>{}


//using promises

const asyncHandler =(requestHandler) =>{
   return (req,res,next) =>{
    Promise.resolve(requestHandler(req,res,next))
    .catch((err) => next(err))
  }
}

export {asyncHandler}


//Using TRY and CATCH

// const asyncHandler = (fn) => async (req,res,next)=>{

//   try{
//     await fn(req,res,next)

//   }
//   catch(error){
//     res.status(error.code || 500).json({
//         success: false,
//         message: error.message
//     })

//   }


// }


//asyn is higer order function-high order function is which can accept as parameter and can also return