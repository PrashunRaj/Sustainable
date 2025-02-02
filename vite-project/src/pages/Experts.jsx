import React from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useContext } from 'react'

const Experts = () => {
  const navigate = useNavigate()
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const { experts } = useContext(AppContext)
  const [showFilter, setShowFilter] = useState(false)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(experts.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(experts)
    }
  }
  useEffect(() => {
    applyFilter()
  }, [experts, speciality])
  return (
    <div>
      <p className='text-gray-600'>Explore Our Experts/Consultants</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'} `}>
       
          <p onClick={() => speciality === 'Solar-Pannel-Installers' ? navigate('/experts') : navigate('/experts/Solar-Pannel-Installers')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Solar-Pannel-Installers' ? "bg-indigo-100 text-black" : ""}`}>Solar-Experts</p>
        
          <p onClick={() => speciality === 'Composting Advisor' ? navigate('/experts') : navigate('/experts/Composting Advisor')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Composting Advisor' ? "bg-indigo-100 text-black" : ""}`}>Composting Advisor</p>
          <p onClick={() => speciality === 'Energy Auditor' ? navigate('/experts') : navigate('/experts/Energy Auditor')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Energy Auditor' ? "bg-indigo-100 text-black" : ""}`}>Energy Auditor</p>
          <p onClick={() => speciality === 'Urban Farming-Expert' ? navigate('/experts') : navigate('/experts/Urban Farming-Expert')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Urban Farming-Expert' ? "bg-indigo-100 text-black" : ""}`}>Urban Farming-Expert</p>
          <p onClick={() => speciality === 'Waste Management-Expert' ? navigate('/experts') : navigate('/experts/Waste Management-Expert')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Waste Management-Expert' ? "bg-indigo-100 text-black" : ""}`}>Waste Management-Expert</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`/appointments/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 group' key={index}>
                <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'} `}>
                    <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p>
                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium '>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>

                </div>


              </div>

            ))}

        </div>
      </div>

    </div>
  )
}

export default Experts