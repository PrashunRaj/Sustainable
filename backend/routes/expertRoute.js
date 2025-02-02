import express from 'express'
import { expertList,loginExpert ,appointmentsExpert,appointmentCancel,appointmentComplete,expertDashboard,expertProfile,updateExpertProfile} from '../controllers/expertController.js'
import authExpert from '../middlewares/authExpert.js'


const expertRouter=express.Router()
expertRouter.get('/list',expertList)
expertRouter.post('/login',loginExpert)
expertRouter.get('/appointments',authExpert,appointmentsExpert)
expertRouter.post('/complete-appointment',authExpert,appointmentComplete)
expertRouter.post('/cancel-appointment',authExpert,appointmentCancel)
expertRouter.get('/dashboard',authExpert,expertDashboard)
expertRouter.get('/profile',authExpert,expertProfile)
expertRouter.post('/update-profile',authExpert,updateExpertProfile)
export default expertRouter