import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    description: '',
    location: '',
    image: null
  });
  const { backendUrl, aToken } = useContext(AdminContext)

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle file input separately
    if (name === 'image') {
      setEventData(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setEventData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const { title, date, description, location } = eventData;
    
    if (!title) {
      toast.error('Title is required');
      return false;
    }
    if (!date) {
      toast.error('Date is required');
      return false;
    }
    if (!description) {
      toast.error('Description is required');
      return false;
    }
    if (!location) {
      toast.error('Location is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('date', eventData.date);
    formData.append('description', eventData.description);
    formData.append('location', eventData.location);
    
    // Append image if selected
    if (eventData.image) {
      formData.append('image', eventData.image);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(backendUrl+'/api/admin/add-event', formData, {
        headers: {
          aToken
        }
      });

      if (response.data.success) {
        toast.success('Event added successfully');
        // Reset form after successful submission
        setEventData({
          title: '',
          date: '',
          description: '',
          location: '',
          image: null
        });
        
        // Optional: Clear file input
        if (document.getElementById('image')) {
          document.getElementById('image').value = '';
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add event');
      console.error('Event addition error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="max-h-[80vh] overflow-y-auto p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Add New Event</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-gray-700 mb-2">Event Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter event location"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter event description"
                  rows="4"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-gray-700 mb-2">Event Image (Optional)</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-lg text-white font-bold ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                  }`}
                >
                  {isLoading ? 'Adding Event...' : 'Add Event'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;