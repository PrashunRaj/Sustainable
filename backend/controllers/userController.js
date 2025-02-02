import validator from 'validator'
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary} from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js'
import expertModel from '../models/expertModel.js'
import razorpay from 'razorpay'
import nodemailer from 'nodemailer'
import crypto from 'crypto';
import reviewModel from '../models/reviewModel.js';
import eventModel from '../models/eventModel.js'
import videoModel from '../models/videoModel.js'
import pdf from 'html-pdf';
import workshopModel from '../models/WorkshopModel.js'





//Api to register user
const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body

        if(!name || !password || !email){
            return res.json({success:false,message:"Missing Details"})

        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"enter a valid email"})

        }
        if(password.length<8){
            return res.json({success:false,message:"enter a strong password"})
        }

        //hashing user password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const userData={
            name,
            email,
            password:hashedPassword
        }
        const newUser=new userModel(userData)
        const user=await newUser.save()

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})


    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

//Api for user Login
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:'User dos not exist'})
        }
        const isMatch=await bcrypt.compare(password,user.password)

        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})

        
    }
    
    
}

//Api to get user profile data
const getProfile=async(req,res)=>{
    try{

        const {userId}=req.body
        const userData= await userModel.findById(userId).select('-password')
        res.json({success:true,userData})

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}
//Api to update user profile
const updateProfile=async(req,res)=>{
    try{
        const {userId,name,email,phone,address,dob,gender}=req.body
        const imageFile=req.file
        if(!name || !phone || !dob || !gender){
            return res.json({success:false,message:"Data Missing"})

        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

        if(imageFile){
            //upload image to cloudinary

            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL=imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success:true,message:"Profile Updated Successfully"})


    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }

}

//api ot book appointment
const bookAppointment=async(req,res)=>{
    try{
        const {userId,docId,slotDate,slotTime,serviceType}=req.body
        const docData=await expertModel.findById(docId).select('-password')
         if(!docData.available){
            return res.json({success:false,message:'Doctor not available'})
         }
         let slots_booked=docData.slots_booked

         //checking for slot avilability
         if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'Slot not available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }

         }else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
         }

         const userData=await userModel.findById(userId).select('-password')
         delete docData.slots_booked

         const appointmentData={
            userId,
            docId,
            userData,
            docData,
            serviceType,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
         }
         const newAppointment=new appointmentModel(appointmentData)
         await newAppointment.save()

         //save new slot data in ExpertData
         await expertModel.findByIdAndUpdate(docId,{slots_booked})
         res.json({success:true,message:'Appointment Booked'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}
//api to get user appointment for frontend my-appointments page

const listAppointment=async(req,res)=>{
    try{
        const {userId}=req.body
        const appointments=await appointmentModel.find({userId})
        res.json({success:true,appointments})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    } 
}

//Api to cancel appointmentModel
const cancelAppointment=async(req,res)=>{
    try{
        
        const {userId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        //verify appointment user
        if(appointmentData.userId!=userId){
            return res.json({success:false,message:'Unauthorized'})
        }

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

const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
//api to make payment of appointment using razorpay

const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) { 
            return res.json({ success: false, message: 'Appointment cancelled or not found' });
        }

        // Apply 30% discount if serviceType is 'Virtual'
        let finalAmount = appointmentData.amount;
        if (appointmentData.serviceType === 'Virtual') {
            finalAmount = finalAmount * 0.7; // 30% discount
        }

        // Options for Razorpay payment
        const options = {
            amount: Math.round(finalAmount * 100), // Convert to smallest currency unit
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        };

        // Creating an order
        const order = await razorpayInstance.orders.create(options);

        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//api to verify payement of razor pay

const verifyRazorpay=async(req,res)=>{
    try{
        const {razorpay_order_id}=req.body
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status==='paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:'Payment Successfull'})
        }else{
            res.json({success:false,message:'Payment Failed'})
        }
        //console.log(orderInfo)
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

const createUserHTMLTemplate = (userData, docData, slotDate, slotTime) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            margin-top: 20px;
        }
        .appointment-details {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            background-color: #f1f1f1;
            border-radius: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Appointment Confirmation</h1>
    </div>
    
    <div class="content">
        <h2>Dear ${userData.name},</h2>
        <p>Your appointment has been successfully scheduled with our Eco Consultant Expert.</p>
        
        <div class="appointment-details">
            <h3>Appointment Details</h3>
            <table>
                <tr>
                    <th>Detail</th>
                    <th>Information</th>
                </tr>
                <tr>
                    <td>Consultant Name</td>
                    <td>Mr. ${docData.name}</td>
                </tr>
                <tr>
                    <td>Date</td>
                    <td>${slotDate}</td>
                </tr>
                <tr>
                    <td>Time</td>
                    <td>${slotTime}</td>
                </tr>
                <tr>
                    <td>Patient Name</td>
                    <td>${userData.name}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>${userData.email}</td>
                </tr>
            </table>
        </div>
    </div>
    
    <div class="footer">
        <p>Thank you for choosing our services!</p>
        <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
        <p>For any queries, please reach out to our support team.</p>
    </div>
</body>
</html>
`;

// HTML template for Expert PDF
const createDoctorHTMLTemplate = (userData, docData, slotDate, slotTime) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2196F3;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            margin-top: 20px;
        }
        .appointment-details {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            background-color: #f1f1f1;
            border-radius: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #2196F3;
            color: white;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Appointment Notification</h1>
    </div>
    
    <div class="content">
        <h2>Dear MR. ${docData.name},</h2>
        <p>A new appointment has been scheduled with you by ${userData.name}.</p>
        
        <div class="appointment-details">
            <h3>Appointment Details</h3>
            <table>
                <tr>
                    <th>Detail</th>
                    <th>Information</th>
                </tr>
                <tr>
                    <td>Client Name</td>
                    <td>${userData.name}</td>
                </tr>
                <tr>
                    <td>Client Email</td>
                    <td>${userData.email}</td>
                </tr>
                <tr>
                    <td>Appointment Date</td>
                    <td>${slotDate}</td>
                </tr>
                <tr>
                    <td>Appointment Time</td>
                    <td>${slotTime}</td>
                </tr>
            </table>
        </div>
    </div>
    
    <div class="footer">
        <p>Please review the appointment details.</p>
        <p>If you need to make any changes, please contact the administrative team.</p>
    </div>
</body>
</html>
`;

// PDF configuration options
const pdfOptions = {
    format: 'Letter',
    border: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
    }
};

// Function to create PDF
const createPDF = (htmlContent) => {
    return new Promise((resolve, reject) => {
        pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
};

const sendEmail = async (req, res) => {
    try {
        const { appointmentId, token } = req.body;
        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(400).json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        const { docData, slotDate, slotTime, userData } = appointment;

        // Generate different HTML content for user and expert
        const userHtmlContent = createUserHTMLTemplate(userData, docData, slotDate, slotTime);
        const expertHtmlContent = createDoctorHTMLTemplate(userData, docData, slotDate, slotTime);

        // Generate PDFs
        const userPdfBuffer = await createPDF(userHtmlContent);
        const expertPdfBuffer = await createPDF(expertHtmlContent);

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Send email to user
        const userMailOptions = {
            from: process.env.EMAIL,
            to: userData.email,
            subject: 'Your Appointment Confirmation',
            html: userHtmlContent,
            attachments: [{
                filename: 'appointment-confirmation.pdf',
                content: userPdfBuffer,
                contentType: 'application/pdf'
            }]
        };

        // Send email to expert
        const expertMailOptions = {
            from: process.env.EMAIL,
            to: docData.email,
            subject: 'New Appointment Scheduled',
            html: expertHtmlContent,
            attachments: [{
                filename: 'new-appointment.pdf',
                content: expertPdfBuffer,
                contentType: 'application/pdf'
            }]
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(userMailOptions),
            transporter.sendMail(expertMailOptions)
        ]);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Emails sent successfully' 
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};



//api to schedule a meeting and generate a link and return that link

/**
 * Generate a Jitsi meeting link locally
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
const generateMeetingLink = async (req, res) => {
    try {
        // Generate a unique meeting room ID
        const meetingId = crypto.randomBytes(8).toString('hex'); // Random meeting room

        // Define Jitsi domain (update this to your VPaaS domain if needed)
        const jitsiDomain = 'https://8x8.vc'; // Replace with your custom domain if necessary

        // Construct the meeting URL
        const meetingLink = `${jitsiDomain}/${meetingId}`;

        // Find the appointment using the meeting ID passed in req
        const { appointmentId } = req.body; // Assuming the appointment ID is passed in the body
        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found.',
            });
        }

        // Update the appointment with the meeting link
        appointment.meetingLink = meetingLink;
        await appointment.save();

        // Respond with the generated meeting link
        res.status(200).json({
            success: true,
            meetingLink,
            message: 'Meeting link generated and saved successfully!',
        });
    } catch (error) {
        console.error('Error generating meeting link:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};


// API to add review
const addReview = async (req, res) => {
    
    try {
        console.log("kya be");
      const {
        userId,
        expertId,
        rating,
        title,
        review,
        wouldRecommend,
      } = req.body;
    
      // Validate required fields
      if (!userId || !expertId || !rating || !title || !review) {
        return res.json({ success: false, message: 'All fields are required' });
      }
  
      // Validate rating
      if (rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'Rating must be between 1 and 5' });
      }
  
      // Check if expert exists
      const expertData = await expertModel.findById(expertId).select('name speciality');
      if (!expertData) {
        return res.json({ success: false, message: 'Expert not found' });
      }
  
      // Check if user exists
      const userData = await userModel.findById(userId).select('name email image');
      if (!userData) {
        return res.json({ success: false, message: 'User not found' });
      }
  
      // Create review data
      const reviewData = {
        rating,
        name: userData.name,
        email: userData.email,
        title,
        review,
        wouldRecommend,
        expertName: expertData.name,
        expertRole: expertData.speciality,
        image: userData.image,
      };
  
      // Save review
      const newReview = new reviewModel(reviewData);
      await newReview.save();
  
      res.json({ success: true, message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.log("kya hal");
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  //api to get review 
  // API to get all reviews
const getReview = async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
  
      // Convert `order` to sort order
      const sortOrder = order === 'asc' ? 1 : -1;
  
      // Fetch reviews with pagination and sorting
      const reviews = await reviewModel
        .find() // No filter applied, fetches all reviews
        .sort({ [sortBy]: sortOrder }) // Apply sorting
        .skip((page - 1) * limit) // Skip documents for pagination
        .limit(parseInt(limit)); // Limit the number of documents
  
      // Count the total number of reviews
      const totalReviews = await reviewModel.countDocuments();
  
      res.json({
        success: true,
        message: 'All reviews fetched successfully',
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
        },
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  // Get events with optional filtering and pagination
const getEvents = async (req, res) => {
    try {
        // Extract query parameters
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'date', 
            order = 'asc',
            search = '',
            startDate,
            endDate
        } = req.query;
  
        // Create a filter object
        const filter = {};
  
        // Add search filter if search term is provided
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
  
        // Add date range filter if start and/or end dates are provided
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.date.$lte = new Date(endDate);
            }
        }
  
        // Convert page and limit to numbers and ensure they're positive
        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Math.max(1, parseInt(limit));
  
        // Create sort object
        const sortOptions = {};
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;
  
        // Fetch events with pagination and sorting
        const events = await eventModel
            .find(filter)
            .sort(sortOptions)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
  
        // Count total events for pagination info
        const totalEvents = await eventModel.countDocuments(filter);
  
        // Send response
        res.json({
            success: true,
            events,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalEvents / limitNumber),
                totalEvents,
                eventsPerPage: limitNumber
            }
        });
  
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
  };

  //api to fetch video

  const getAllVideos = async (req, res) => {
    try {
      // Extract optional filters from query parameters
      const { category, level } = req.query;
  
      // Create a filter object based on query parameters
      const filter = {};
      if (category) filter.category = category;
      if (level) filter.level = level;
  
      // Fetch all videos matching the filter criteria
      const videos = await videoModel.find(filter);
  
      // If no videos are found, respond accordingly
      if (!videos || videos.length === 0) {
        console.log("hello")
        return res.status(404).json({ success: false, message: 'No videos found' });
      }
  
      // Return the list of videos
      return res.status(200).json({ success: true, videos });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  };

  //api to get-all workshop
  const GetAllWorkshops = async (req, res) => {
    try {
       console.log('hello9')
      const workshops = await workshopModel.find({});
      
      res.status(200).json({ workshops });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay,sendEmail,generateMeetingLink,addReview,getEvents,getReview,getAllVideos,GetAllWorkshops}
   