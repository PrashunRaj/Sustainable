import { createContext } from "react";
import { useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
export const AdminContext=createContext()
const AdminContextProvider=(props)=>{

    const[aToken,setAToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
     const [experts,setExperts]=useState([])
     const [appointments,SetAppointments]=useState([])
     const [dashData,setDashData]=useState(false)
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const getAllExperts=async()=>{
        try{
            const { data }=await axios.post(backendUrl+'/api/admin/all-experts',{},{headers:{aToken}})
         
            if(data.success){
              
                setExperts(data.experts)
                console.log(data.experts);
            }else{
             
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }
    const changeAvailability=async(docId)=>{
        try{
            const { data }=await axios.post(backendUrl+'/api/admin/change-availability',{docId},{headers:{aToken}})
            if(data.success){
                console.log('hello')
                toast.success(data.message)
                getAllExperts()
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    const getAllAppointments=async()=>{
        try{
            const {data}=await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}})
            if(data.success){
                SetAppointments(data.appointments)
              
            }else{
                toast.error(data.message);
            }


        }catch(error){
            toast.error(error.message)

        }

    }
    

    const getDashData=async()=>{
        try{
            const {data}=await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}})
            if(data.success){
                console.log(data.dashData)
                setDashData(data.dashData)
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message);

        }

    }
    const cancelAppointment=async(appointmentId)=>{
        try{
            const {data}=await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
            if(data.success){
                toast.success(data.message);
                getAllAppointments()
                getDashData()
            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(error.message);

        }
    }
    const value={
        aToken,setAToken,
        backendUrl,experts,
        getAllExperts,
        changeAvailability,
        appointments,
        SetAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashData,

    }
   
    return (
        <AdminContext.Provider value={value}>
           {props.children}
        </AdminContext.Provider>

    )
}

export default AdminContextProvider