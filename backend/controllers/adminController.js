import validator from 'validator'
import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary'
import expertModel from "../models/expertModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import videoModel from '../models/videoModel.js';
import eventModel from '../models/eventModel.js'
import Workshop from '../models/WorkshopModel.js';
import crypto from 'crypto';



import fs from 'fs';

//Api for adding expert
const addExpert=async(req,res)=>{
    try{
        const {name,email,password,speciality,about,degree,experience,address,fees}=req.body;
        const imageFile=req.file;
        if(!name || !email || !password || !speciality ||!about || !degree|| !experience || !address || !fees){
            return res.json({success:false,message:"Missing Details"})
        }
        //validating email format

        if(!validator.isEmail(email)){
            return res.json({success:false,message:"please enter a valid email"})
        }

        //validating password
        if(password.length<8){
            return res.json({succes:false,message:"Please enter a strong passowrd"})
        }

        //hashing expert password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        //upload image to cloudinary
        // const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        // const imageUrl=imageUpload.secure_url
        let imageUrl;
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        } else {
            imageUrl ="data:image/png;base64,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"; // Replace with your default image URL
        }

        const expertData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newExpert=new expertModel(expertData)
        await newExpert.save()
        res.json({success:true,message:"Consultant Added"})
        //console.log({name,email,password,speciality,about,degree,experience,address,fees},imageFile)
    }catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}


//api for admin login
const loginAdmin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(email==process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})

        }

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
        
    }

}

//api to get all expert list fro admin panel

const allExperts=async(req,res)=>{
    try{
        const experts=await expertModel.find({}).select('-password')
        res.json({success:true,experts})

    }catch(error){
        console.log(error)
        res.json({sucess:false,message:error.message});
    }
}
//Api to get all apointments list
const appointmentsAdmin=async(req,res)=>{
    try{
        const appointments=await appointmentModel.find({})
        res.json({success:true,appointments})

    }catch(error){
        console.log(error)
        res.json({sucess:false,message:error.message});
    }
}
//api to cancel appointment
const appointmentCancel=async(req,res)=>{
    try{
        
        const {appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
      

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //release expert slot
        const {docId,slotDate,slotTime}=appointmentData
        const expertdata=await expertModel.findById(docId)

        let slots_booked=expertdata.slots_booked

        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!=slotTime)

        await expertModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment Cancelled'})

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }

}
//api to get dashboard data for admin panel
const adminDashboard=async(req,res)=>{
    try{
        const experts=await expertModel.find({})
        const users=await userModel.find({})
        const appointments=await appointmentModel.find({})

        const dashData={
            experts:experts.length,
            appointments:appointments.length,
            clients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)

        }
        res.json({success:true,dashData})

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}
//api to add video tutorials

// API for adding a video


const addVideo = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      duration, 
      category, 
      level 
    } = req.body;

    // Validate required fields
    if (!title || !description || !duration || !category || !level) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate level field
    if (!["Beginner", "Intermediate", "Advanced"].includes(level)) {
      return res.status(400).json({ success: false, message: 'Invalid level value' });
    }

    // Handle thumbnail and video files
    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];

    // Check if at least a video file or URL is provided
    if (!videoFile && !req.body.videoUrl) {
      return res.status(400).json({ success: false, message: 'A video file or a video URL is required' });
    }

    // Upload files to Cloudinary if provided
    let thumbnailUrl, videoUrl;

    if (thumbnailFile) {
      const thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile.path, {
        resource_type: 'image',
      });
      thumbnailUrl = thumbnailUpload.secure_url;
    } else {
      thumbnailUrl = req.body.thumbnail; // Fallback to provided URL
    }

    if (videoFile) {
      const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
        resource_type: 'video',
      });
      videoUrl = videoUpload.secure_url;
    } else {
      videoUrl = req.body.videoUrl; // Fallback to provided URL
    }

    // Save video data to the database
    const newVideo = new videoModel({
      title,
      description,
      thumbnail: thumbnailUrl,
      duration,
      category,
      level,
      videoUrl,
    });

    await newVideo.save();

    return res.status(201).json({ 
      success: true, 
      message: 'Video added successfully', 
      video: newVideo 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
// Add new event with file upload
const addEvent = async (req, res) => {
  try {
      const { 
          title, 
          date, 
          description, 
          location 
      } = req.body;

      // Validate required fields
      if (!title || !date || !description || !location) {
          return res.json({ 
              success: false, 
              message: 'All fields are required' 
          });
      }

      // Check if file exists
      let imageUrl = '';
      if (req.file) {
          // Upload image to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: 'events', // Optional: organize uploads in a folder
              resource_type: 'image'
          });

          imageUrl = result.secure_url;

          // Remove temporary file
          fs.unlinkSync(req.file.path);
      }

      const newEvent = new eventModel({
          title,
          date: new Date(date), // Convert to Date object
          image: imageUrl || '/default-event-image.jpg', // Default image fallback
          description,
          location
      });

      await newEvent.save();

      res.json({ 
          success: true, 
          message: 'Event added successfully',
          event: newEvent 
      });

  } catch (error) {
      console.error(error);
      // Remove temp file if upload fails
      if (req.file) {
          fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ 
          success: false, 
          message: error.message 
      });
  }
};
//api to get event
const getEvents = async (req, res) => {
    try {
        const { limit = 100, sortBy = 'date', order = 'desc' } = req.query;

        // Validate sorting order
        const sortOrder = order === 'asc' ? 1 : -1;

        // Fetch events from the database
        const events = await eventModel.find()
            .sort({ [sortBy]: sortOrder })
            .limit(parseInt(limit));
        return res.json({
            success: true,
            events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch events'
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Check if event exists
        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Delete image from Cloudinary if it exists
        if (event.image && event.image !== '/default-event-image.jpg') {
            try {
                // Extract public_id from Cloudinary URL
                const publicId = event.image.split('/').slice(-1)[0].split('.')[0];
                await cloudinary.uploader.destroy(`events/${publicId}`);
            } catch (cloudinaryError) {
                console.error('Cloudinary deletion error:', cloudinaryError);
                // Continue with event deletion even if image deletion fails
            }
        }

        // Delete event from database
        await eventModel.findByIdAndDelete(eventId);

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
};

//api to add Workshop
const generateMeetingLink = () => {
    const meetingId = crypto.randomBytes(8).toString("hex");
    const jitsiDomain = "https://8x8.vc";
    return `${jitsiDomain}/${meetingId}`;
  };
  
  const AddWorkshop = async (req, res) =>{
    try {
        console.log('hello');
      const { title, description, date, time, location, capacity, tags } = req.body;
      if (!title || !description || !date || !time || !location || !capacity){
        return res.status(400).json({ message: "All fields are required" });
      }
      const meetLink = generateMeetingLink();
      
      const newWorkshop = new Workshop({
        title,
        description,
        date,
        time,
        location,
        meetLink,
        capacity,
        tags,
      });
      
      await newWorkshop.save();
      res.status(201).json({ success:true,message: "Workshop added successfully", workshop: newWorkshop });
    } catch (error) {
      res.status(500).json({ success:false,message: "Server error", error: error.message });
    }
  };
  

//-----------
//api to remove workshop

const RemoveWorkshop = async (req, res) => {
    try {
      const { id } = req.params;
  
      const workshop = await Workshop.findByIdAndDelete(id);
  
      if (!workshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
  
      res.status(200).json({ message: "Workshop removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  //api to get workshops
  const GetAllWorkshops = async (req, res) => {
    try {
      const workshops = await Workshop.find();
      res.status(200).json({ workshops });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


export {addExpert,loginAdmin,allExperts,appointmentsAdmin,appointmentCancel,adminDashboard,addVideo,addEvent,deleteEvent,getEvents,AddWorkshop,RemoveWorkshop,GetAllWorkshops}