// import React, { useState, useEffect, useContext } from 'react';
// import { Trash2 } from 'lucide-react';
// import { AdminContext } from '../../context/AdminContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const AllEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { backendUrl, atoken } = useContext(AdminContext);

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${backendUrl}/api/user/get-event`, {
//         headers: { atoken },
//         params: {
//           limit: 100, // Increased limit for admin view
//           sortBy: 'date',
//           order: 'desc',
//         },
//       });
//       setEvents(response.data.events || []);
//     } catch (error) {
//       toast.error('Failed to fetch events');
//       console.error('Failed to fetch events:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, [backendUrl, atoken]);

//   const handleDelete = async (eventId) => {
//     if (window.confirm('Are you sure you want to delete this event?')) {
//       try {
//         await axios.delete(`${backendUrl}/api/admin/delete-event/${eventId}`, {
//           headers: { atoken },
//         });
//         toast.success('Event deleted successfully');
//         fetchEvents(); // Refresh the list
//       } catch (error) {
//         toast.error('Failed to delete event');
//         console.error('Failed to delete event:', error);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-xl text-gray-600">Loading events...</div>
//       </div>
//     );
//   }

//   return (
//     <Card className="w-full max-w-6xl mx-auto">
//       <CardContent className="p-6">
//         <h2 className="text-3xl font-bold mb-6">All Events</h2>
        
//         {events.length === 0 ? (
//           <div className="text-center text-gray-500 py-8">
//             No events available at the moment.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Location</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead className="w-[100px]">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {events.map((event) => (
//                   <TableRow key={event._id}>
//                     <TableCell className="font-medium">
//                       {new Date(event.date).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>{event.title}</TableCell>
//                     <TableCell>{event.location}</TableCell>
//                     <TableCell className="max-w-md truncate">
//                       {event.description}
//                     </TableCell>
//                     <TableCell>
//                       <button
//                         onClick={() => handleDelete(event._id)}
//                         className="p-2 text-red-600 hover:text-red-800 transition-colors"
//                         title="Delete event"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AllEvents;
import React, { useState, useEffect, useContext } from 'react';
import { Trash2 } from 'lucide-react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const { backendUrl, aToken } = useContext(AdminContext);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/admin/get-event`,{
        headers:{aToken}
      });
      setEvents(response.data.events || []);
    } catch(error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [backendUrl, aToken]);

  const handleDelete = async () => {
    if (!eventToDelete) return;
    try {
      await axios.delete(`${backendUrl}/api/admin/delete-event/${eventToDelete}`, {
        headers:{aToken},
      });
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error){
      toast.error('Failed to delete event');
    } finally {
      setShowModal(false);
      setEventToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-xl text-gray-600">
        Loading events...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 w-full overflow-x-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">All Events</h2>
      {events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No events available at the moment.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 md:px-4 py-2 text-left">Date</th>
                <th className="px-2 md:px-4 py-2 text-left">Title</th>
                <th className="px-2 md:px-4 py-2 text-left">Location</th>
                <th className="px-2 md:px-4 py-2 text-left">Description</th>
                <th className="px-2 md:px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-t border-gray-300">
                  <td className="px-2 md:px-4 py-2">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="px-2 md:px-4 py-2">{event.title}</td>
                  <td className="px-2 md:px-4 py-2">{event.location}</td>
                  <td className="px-2 md:px-4 py-2 max-w-xs truncate">{event.description}</td>
                  <td className="px-2 md:px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        setEventToDelete(event._id);
                        setShowModal(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-11/12 md:w-96">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="my-4">Are you sure you want to delete this event?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;