import expertModel from '../models/expertModel.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'

const changeAvailability = async (req, res) => {
    try{

        const {docId}=req.body
        const docData=await expertModel.findById(docId)
        await expertModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:"Availability changed successfully"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const expertList=async(req,res)=>{
    try{
        const experts=await expertModel.find({}).select(['-password','-email'])
        res.json({success:true,experts})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }

}
//api for expert login
const loginExpert=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const expert=await expertModel.findOne({email})

        if(!expert){
            return res.json({success:false,message:"Invalid Credentials"})

        }
        const isMatch=await bcrypt.compare(password,expert.password)
        if(isMatch){
            const token=jwt.sign({id:expert._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid Credentials"})

        }


    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

//api to get expert appointments for expert panel
const appointmentsExpert=async(req,res)=>{
    try{
        const {docId}=req.body
        const appointments=await appointmentModel.find({docId})

        res.json({success:true,appointments})
       

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}
//api to mark appointment completed from expert panel
const appointmentComplete=async(req,res)=>{
    try{
        const {docId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId==docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            return res.json({success:true,message:'Appointment Completed'})
        }else{
            return res.json({success:false,message:"Mark Failed"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

//api to mark appointment cancel from expert panel
const appointmentCancel=async(req,res)=>{
    try{
        const {docId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId==docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            return res.json({success:true,message:'Appointment Cancelled'})
        }else{
            return res.json({success:false,message:"Cancellation Failed"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}
//api to get dasboard data for expert panel

const expertDashboard=async(req,res)=>{
    try{
        const {docId}=req.body;

        const appointments=await appointmentModel.find({docId})
        let earnings=0;

        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings+=item.amount
            }
        })
         let clients=[]

         appointments.map((item)=>{
            if(!clients.includes(item.userId)){
                clients.push(item.userId)
            }
         })
         const dashData={
            earnings,
            appointments:appointments.length,
            clients:clients.length,
            latestAppointments:appointments.reverse().slice(0,5)

         }
         res.json({success:true,dashData})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}
//api to get expert profile for Expert Panel
const expertProfile=async(req,res)=>{

    try{
        const {docId}=req.body
        const profileData=await expertModel.findById(docId).select('-password')
        res.json({success:true,profileData})

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }

}
//api to edit expert profile from expert panel
const updateExpertProfile=async(req,res)=>{
    try{
        const {docId,fees,address,available}=req.body
        await expertModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:"Profile Updated"})

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.messsage})
    }
}
export {changeAvailability,expertList,loginExpert,appointmentsExpert,appointmentComplete,appointmentCancel,expertDashboard,expertProfile,updateExpertProfile}