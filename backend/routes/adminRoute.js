import express from 'express';
import { addExpert,allExperts,loginAdmin,appointmentsAdmin,appointmentCancel,adminDashboard,addVideo,addEvent,deleteEvent,getEvents,AddWorkshop,RemoveWorkshop,GetAllWorkshops} from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';

import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/expertController.js';
import uploadVideoWithThumbnail from '../middlewares/multer2.js';

const adminRouter=express.Router();

adminRouter.post('/add-expert',authAdmin,upload.single('image'),addExpert)
adminRouter.post('/login',loginAdmin);
adminRouter.post('/all-experts',authAdmin,allExperts);
adminRouter.post('/change-availability',authAdmin,changeAvailability);
adminRouter.get('/appointments',authAdmin,appointmentsAdmin);
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
adminRouter.get('/get-event',authAdmin,getEvents)
adminRouter.post('/add-video', authAdmin, uploadVideoWithThumbnail, addVideo);
adminRouter.post('/add-event',authAdmin,upload.single('image'),addEvent)
adminRouter.delete('/delete-event/:eventId', authAdmin, deleteEvent);
adminRouter.delete('/remove-workshop/:id', authAdmin,RemoveWorkshop); 
adminRouter.post('/add-workshop',authAdmin,AddWorkshop)
adminRouter.get('/get-all-workshops',authAdmin,GetAllWorkshops)


export default adminRouter;