import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ExpertContext } from '../context/ExpertContext'

const Sidebar = () => {

    const {aToken}=useContext(AdminContext)
    const {dToken}=useContext(ExpertContext)
  return (
    <div className='min-h-screen bg-white border-r'>
        {
            aToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`}to={'/admin-dashboard'}>
                    <img className="w-6 h-6 md:w-8 md:h-8"src={assets.home_icon} alt="" />
                    <p  className='hidden md:block'>Dashboard</p>
                </NavLink>

                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/all-appointments'}>
                    <img className="w-6 h-6 md:w-8 md:h-8" src={assets.appointment_icon} alt="" />
                    <p  className='hidden md:block'>Appointment</p>
                </NavLink>

                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/add-expert'}>
                    <img className="w-6 h-6 md:w-8 md:h-8" src={assets.add_icon} alt="" />
                    <p  className='hidden md:block'>Add Consultants</p>
                </NavLink>

                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/expert-list'}>
                    <img className="w-6 h-6 md:w-8 md:h-8" src={assets.people_icon} alt="" />
                    <p  className='hidden md:block'>Consultants List</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/upload-video'}>
                    <img className="w-6 h-6 md:w-8 md:h-8" src={assets.add_icon} alt="" />
                    <p  className='hidden md:block'>Add Video Tutorials</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/add-Event'}>
                    <img className="w-6 h-6 md:w-8 md:h-8" src={assets.add_icon} alt="" />
                    <p  className='hidden md:block'>Add Latest Events</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/all-event'}>
                    <img className="w-6 h-6 md:w-8 md:h-8" src={assets.add_icon} alt="" />
                    <p  className='hidden md:block'>All Events</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/add-workshop'}>
                    <img className="w-6 h-6 md:w-8 md:h-8" src={assets.add_icon} alt="" />
                    <p  className='hidden md:block'>Add Workshops</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/all-workshop'}>
                    <img className="w-6 h-6 md:w-8 md:h-8" src={assets.all_event} alt="" />
                    <p  className='hidden md:block'>All Workshops</p>
                </NavLink>
            </ul>
        } 
           {
            dToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`}to={'/expert-dashboard'}>
                    <img className="w-6 h-6 md:w-8 md:h-8"src={assets.home_icon} alt="" />
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>

                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/expert-appointments'}>
                    <img className="w-6 h-6 md:w-8 md:h-8"src={assets.appointment_icon} alt="" />
                    <p  className='hidden md:block'>Appointments</p>
                </NavLink>


                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/expert-profile'}>
                    <img className="w-6 h-6 md:w-8 md:h-8"src={assets.people_icon} alt="" />
                    <p  className='hidden md:block'>Profile</p>
                </NavLink>
            </ul>
        } 

    </div>
  )
}

export default Sidebar