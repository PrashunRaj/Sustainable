

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Link, UserCheck } from 'lucide-react';
import { AppContext } from '../context/AppContext';

function slotDateFormat(isoDate) {
  const date = new Date(isoDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

const WorkshopCard = ({ workshop }) => {
  return (
    <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl 
      transition-all duration-500 ease-in-out transform hover:-translate-y-2 
      border border-transparent hover:border-green-300 
      bg-white p-6">
      
      <div className="absolute inset-0 border-4 border-transparent group-hover:animate-border-spin 
        group-hover:border-green-300 rounded-xl pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-3 text-green-800 group-hover:text-green-900 transition-colors">
          {workshop.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
          {workshop.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="mr-2 text-green-600" size={20} />
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-sm font-semibold">{slotDateFormat(workshop.date)}</span>
              <span className="hidden sm:inline mx-2 text-gray-400">•</span>
              <span className="text-xs text-gray-500">{workshop.time}</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-700">
            <MapPin className="mr-2 text-green-600" size={20} />
            <span className="text-sm">{workshop.location}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <UserCheck className="mr-2 text-green-600" size={20} />
            <span className="text-sm">{workshop.capacity} Spots Available</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="flex flex-wrap gap-1">
            {workshop.tags.map((tag, index) => (
              <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <a 
            href={workshop.meetLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center bg-green-500 hover:bg-green-600 
              text-white text-xs px-3 py-2 rounded-md flex items-center 
              justify-center transition-colors duration-300 group">
            <Link className="mr-1 group-hover:rotate-45 transition-transform" size={14} />
            Join Workshop
          </a>
        </div>
      </div>
    </div>
  );
};

const Workshop = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl, token } = useContext(AppContext);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        console.log("workshop")
        const response = await axios.get(backendUrl+'/api/user/get-all-workshops');
        setWorkshops(response.data.workshops);
        console.log(workshops.time)
        console.log('w2')
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkshops();
  }, []);

  if (loading) return <div className="text-center text-green-600 text-lg">Loading workshops...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-12 text-green-800">
        Sustainability Workshops
      </h1>
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
         {workshops.length>0? (
          workshops.map((workshop) => <WorkshopCard key={workshop.id} workshop={workshop} />)
        ) : (
          <p className="text-center text-gray-600 col-span-full">No workshops available.</p>
        )}
      </div>
    </div>
  );
};
export default Workshop;