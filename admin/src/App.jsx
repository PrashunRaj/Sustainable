import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/SideBar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddExpert from './pages/Admin/AddExpert';
import ExpertsList from './pages/Admin/ExpertsList';
import { ExpertContext} from './context/ExpertContext';
import ExpertDashboard from './pages/Expert/ExpertDashboard';
import ExpertAppointments from './pages/Expert/ExpertAppointments';
import ExpertProfile from './pages/Expert/ExpertProfile';
import VideoUploadForm from './pages/Admin/VideoUploadForm';
import AddEvent from './pages/Admin/AddEvent';
import AllEvents from './pages/Admin/AllEvents';
import AddWorkShop from './pages/Admin/AddWorkShop';
import AllWorkshop from './pages/Admin/AllWorkShop';

const App = () => {
  const {aToken}=useContext(AdminContext)
  const {dToken}=useContext(ExpertContext)
  return aToken || dToken?(
    <div  className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* admin routes */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-appointments' element={<AllAppointments/>} />
          <Route path='/add-expert' element={<AddExpert/>} />
          <Route path='/expert-list' element={<ExpertsList/>} />
          <Route path='/upload-video' element={< VideoUploadForm/>} />
          <Route path='/add-Event' element={< AddEvent/>} />
          <Route path='/all-event' element={<AllEvents />} />
          <Route path='/add-workshop' element={<AddWorkShop/>} />
          <Route path='/all-workshop' element={<AllWorkshop/>} />
          
           {/* Experts routes */}
           <Route path='/expert-dashboard' element={<ExpertDashboard/>} />
           <Route path='/expert-appointments' element={<ExpertAppointments/>} />
           <Route path='/expert-profile' element={<ExpertProfile/>} />
        </Routes>
      </div>
      
    </div>
  ):(
    <>
     <Login/>
     <ToastContainer />
    </>
   
  )
}

export default App