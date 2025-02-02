import axios from "axios";
import { createContext, useState } from "react";
import {toast} from 'react-toastify'
    
export const ExpertContext=createContext()
const ExpertContextProvider=(props)=>{
    const backendUrl=import.meta.env.VITE_BACKEND_URL

    const [dToken,setDToken]=useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')
    const [appointments,SetAppointments]=useState([])
    const [dashData,setDashData]=useState(false)
    const[profileData,setProfileData]=useState(false)
    const getAppointments=async()=>{
        try{

            const {data}= await axios.get(backendUrl+'/api/expert/appointments',{headers:{dToken}})
            if(data.success){
                SetAppointments(data.appointments)
               
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message)
        
        }
    }
    const completeAppointment=async(appointmentId)=>{
        try{
            const {data}=await axios.post(backendUrl+'/api/expert/complete-appointment',{appointmentId},{headers:{dToken}})
            if(data.success){
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)

            }

        }catch(error){
            toast.error(error.message)

        }

    }

    const cancelAppointment=async(appointmentId)=>{
        try{
            const {data}=await axios.post(backendUrl+'/api/expert/cancel-appointment',{appointmentId},{headers:{dToken}})
            if(data.success){
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)

            }

        }catch(error){
            toast.error(error.message)

        }

    }
    const getDashData=async()=>{
        try{
            console.log("try")
            const { data } = await axios.get(`${backendUrl}/api/expert/dashboard`, {headers: {dToken}
            });
         
            if(data.success){
                setDashData(data.dashData)
              

            }else{

                toast.error(data.message)
            }


        }catch(error){
        
            toast.error(error.message)


        }

    }
    const getProfileData=async()=>{
        try{
            const {data}=await axios.get(backendUrl+'/api/expert/profile',{headers:{dToken}})
            if(data.success){
                setProfileData(data.profileData)
                console.log(data.profileData)
                

            }else{
                toast.error(data.message)

            }

        }catch(error){
          
            toast.error(error.message)


        }
    }
    const value={
        dToken,
        setDToken,
        backendUrl,
        appointments,
        SetAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,setDashData,getDashData,
        profileData,setProfileData,getProfileData

    }

    return (
        <ExpertContext.Provider value={value}>
           {props.children}
        </ExpertContext.Provider>

    )
}

export default ExpertContextProvider