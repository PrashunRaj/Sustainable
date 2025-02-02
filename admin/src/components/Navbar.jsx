import React,{ useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { ExpertContext } from '../context/ExpertContext'

const Navbar = () => {

    const {aToken,setAToken}=useContext(AdminContext)
    const {dToken,setDToken}=useContext(ExpertContext)
    const navigate=useNavigate()
    const logout=()=>{
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
        dToken && setDToken('')
        dToken && localStorage.removeItem('dToken')
    }

    
  return (
    <div className='sticky top-0 z-50 flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className='flex items-center gap-2 text-xs'>
            <img className='w-36 sm:w-40 cursor-pointer'src={assets.admin_logo} alt="logo"/>
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken?'Admin':'Consultant'}</p>
        </div>
        {/* <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button> */}
        <button onClick={logout} className='bg-primary text-white text-sm px-3 py-2 rounded-full flex items-center sm:hidden'>
                <img className='w-4 h-5' src={assets.sign_out_icon} alt="Logout" />
            </button>
            <button onClick={logout} className='hidden sm:flex bg-primary text-white text-sm px-10 py-2 rounded-full items-center'>
                <span>Logout</span>
            </button>
    </div>
  )
}
export default Navbar