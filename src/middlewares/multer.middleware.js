// part - 12 middleware: multer

//Multer = Bridge between frontend file and backend processing!

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads') // Save files here
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname) // Keep original name
  }
})

export const upload = multer({ storage: storage })


/*
Frontend sends file
    ↓
Multer intercepts
    ↓
Save to /tmp/my-uploads/filename.mp4
    ↓
req.file.path = "/tmp/my-uploads/filename.mp4"
    ↓
Pass to uploadOnCloudinary()
 *  */ 