import mongoose from 'mongoose';
import mongooseAggreatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new mongoose.Schema(
    {
        videoFile:{
            type:String,  //it will be url of video stored in cloudinary
            required:true
        },
        thumbnail:{
            type:String,  //it will be url of video stored in cloudinary
            required:true
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,  // its come to cloudinary 
            required:true,
        },
        views:{
            type:Number,
            default: 0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }
);

videoSchema.plugin(mongooseAggreatePaginate);

export  const Video = mongoose.model('Video', videoSchema);

