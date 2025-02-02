import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type: String,
    required: true,
    trim: true,
  },
  thumbnail:{
    type: String, // URL to the thumbnail image
    required: true,
  },
  duration:{
    type: String, // e.g., "45 mins"
    required: true,
  },
  category:{
    type: String,// e.g., "Energy", "Environment"
    required: true,
  },
  level:{
    type: String, // e.g., "Beginner", "Intermediate", "Advanced"
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  videoUrl: {
    type: String, // Path to the video file
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const videoModel=mongoose.models.video|| mongoose.model('Video', videoSchema);
export default videoModel;
