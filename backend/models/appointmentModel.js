import mongoose from 'mongoose'

const appointmentSchema=new mongoose.Schema({
    userId:{type:String,required:true},
    docId:{type:String,required:true},
    slotDate:{type:String,required:true},
    slotTime:{type:String,required:true},
    serviceType:{type:String,required:true,default:'Virtual'},
    userData:{type:Object,required:true},
    docData:{type:Object,required:true},
    amount:{type:Number,required:true},
    date:{type:Number,required:true},
    cancelled:{type:Boolean,default:false},
    payment:{type:Boolean,default:false},
    isCompleted:{type:Boolean,default:false},
    meetingLink:{type:String,default:''},
})


const appointmentModel=mongoose.model.appointment || mongoose.model('appointment',appointmentSchema)

//

export default appointmentModel