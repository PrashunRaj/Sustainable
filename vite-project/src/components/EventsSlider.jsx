// import React, { useState, useEffect, useContext } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { toast } from 'react-toastify';

// import axios from 'axios'; // Make sure to import axios
// import { AppContext } from '../context/AppContext';

// const EventsSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [events, setEvents] = useState([]);
//   const {backendUrl,token}=useContext(AppContext)

//   useEffect(() => {
//     // Fetch events from the API using axios
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get(backendUrl+'/api/user/get-event',{headers:{token}});
//         setEvents(response.data); // Assuming the API returns an array of events
//       } catch (error) {
//         toast.error.message('Failed to fetch Event');
//         console.error("Failed to fetch events:", error);
//       }
//     };

//     fetchEvents();

//     // Auto-slide functionality
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % events.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [events.length]); // Dependency on events.length to re-run effect when events change

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % events.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
//   };

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//   };

//   return (
//     <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg bg-white">
//       <h2 className="text-3xl font-bold text-center py-8 text-gray-800">Latest Events</h2>
      
//       {/* Main slider container */}
//       <div className="relative h-[500px]">
//         <div 
//           className="absolute w-full h-full transition-transform duration-500 ease-out flex"
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {events.map((event) => (
//             <div key={event.id} className="w-full h-full flex-shrink-0">
//               <div className="relative h-full">
//                 <img
//                   src={event.image || '/api/placeholder/800/400'} // Use placeholder if no image URL is provided
//                   alt={event.title}
//                   className="w-full h-64 object-cover"
//                 />
//                 <div className="p-6 bg-white">
//                   <div className="flex items-center justify-between mb-4">
//                     <span className="text-sm text-green-600 font-semibold">{event.date}</span>
//                     <span className="text-sm text-gray-600">{event.location}</span>
//                   </div>
//                   <h3 className="text-xl font-bold mb-3 text-gray-800">{event.title}</h3>
//                   <p className="text-gray-600">{event.description}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Navigation buttons */}
//       <button 
//         onClick={prevSlide}
//         className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
//       >
//         <ChevronLeft className="w-6 h-6 text-gray-800" />
//       </button>
//       <button 
//         onClick={nextSlide}
//         className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
//       >
//         <ChevronRight className="w-6 h-6 text-gray-800" />
//       </button>

//       {/* Dots navigation */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//         {events.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-3 h-3 rounded-full transition-all ${
//               currentSlide === index ? 'bg-green-600 w-6' : 'bg-gray-300'
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

//export default EventsSlider;
import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EventsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const { backendUrl, token } = useContext(AppContext);

  const fetchEvents = async (page = 1) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-event`, {
      
        headers: { token },
        params: {
          page,
          limit: 4, // Limit events per page
          sortBy: 'date',
          order: 'asc',
        },
      });
      console.log("hello");
      console.log(response.data)
      setEvents(response.data.events || []);
      setPagination(response.data.pagination || { currentPage: 1, totalPages: 1 });
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [backendUrl, token]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (events.length > 0) {
        if (currentSlide === events.length - 1) {
          if (pagination.currentPage < pagination.totalPages) {
            fetchEvents(pagination.currentPage + 1);
            setCurrentSlide(0); // Reset to first slide on the next page
          } else {
            setCurrentSlide(0); // Loop back to first slide on last page
          }
        } else {
          setCurrentSlide((prev) => prev + 1);
        }
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, events, pagination]);

  const nextSlide = () => {
    if (events.length > 0) {
      if (currentSlide === events.length - 1) {
        if (pagination.currentPage < pagination.totalPages) {
          fetchEvents(pagination.currentPage + 1);
          setCurrentSlide(0);
        } else {
          setCurrentSlide(0);
        }
      } else {
        setCurrentSlide((prev) => prev + 1);
      }
    }
  };

  const prevSlide = () => {
    if (events.length > 0) {
      if (currentSlide === 0) {
        if (pagination.currentPage > 1) {
          fetchEvents(pagination.currentPage - 1);
          setCurrentSlide(events.length - 1);
        } else {
          setCurrentSlide(events.length - 1);
        }
      } else {
        setCurrentSlide((prev) => prev - 1);
      }
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg bg-white">
      <h2 className="text-3xl font-bold text-center py-8 text-gray-800">Latest Events</h2>

      {/* Main slider container */}
      <div className="relative h-[500px]">
        {events.length > 0 ? (
          <div
            className="absolute w-full h-full transition-transform duration-500 ease-out flex"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {events.map((event) => (
              <div key={event._id} className="w-full h-full flex-shrink-0">
                <div className="relative h-full">
                  <img
                    src={event.image || '/api/placeholder/800/400'}
                    alt={event.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-green-600 font-semibold">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-600">{event.location}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No events available at the moment.
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {events.length > 0 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Dots navigation */}
      {events.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-green-600 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsSlider;


