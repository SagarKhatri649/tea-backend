//part - 10 video model



import mongoose,{Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({

  videFile:{
    type: String, // cloudinary url
    required:true,

  },
  thumbnail:{
     type: String, // cloudinary url
    required:true,
  },
  title:{
     type: String,  
    required:true,
  },
  description:{
     type: String, 
    required:true,

  },
  duration:{
    type: String,  
    required:true,

  },
  views:{
    type: Number,
    default:0,
  },
  isPublished:{
    type: Boolean,
    default:true
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }

}
,{
    timestamps:true
})

//Pagination Plugin
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video" ,videoSchema) 






/*

Solution: Pagination

Page 1: Videos 1-10
Page 2: Videos 11-20
Page 3: Videos 21-30
...

What plugin does:

javascript
// Get page 2, 10 videos per page
const result = await Video.aggregatePaginate(
  pipeline,
  { page: 2, limit: 10 }
)

// Returns:
{
  docs: [video11, video12, ...video20],
  totalDocs: 1000,
  totalPages: 100,
  page: 2,
  hasNextPage: true
}
*/