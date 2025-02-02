import express from 'express'
import { registerUser,loginUser, getProfile, updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay,sendEmail ,generateMeetingLink,addReview,getEvents,getReview,getAllVideos,GetAllWorkshops} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
const userRouter=express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)
userRouter.post('/send-email',authUser,sendEmail)
userRouter.post('/generate-meeting-link',authUser,generateMeetingLink)
userRouter.post('/add-review',authUser,addReview);
userRouter.get('/get-event',authUser,getEvents)
userRouter.get('/get-review',getReview)
userRouter.get('/get-all-videos',getAllVideos)
userRouter.get('/get-all-workshops',GetAllWorkshops)


export default userRouter