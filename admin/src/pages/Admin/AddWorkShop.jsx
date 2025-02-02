


import React, { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import axios from 'axios';
import {toast} from 'react-toastify';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext'

const AddWorkshopForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 20,
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const{backendUrl,aToken}=useContext(AdminContext)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post(backendUrl+'/api/admin/add-workshop', formData, {headers:{aToken}});
    
      if(response.data.success){
        toast.success('Workshop added successfully!');
      }else{
        toast.error('Failed to add workshop');
      }
    
      // Optional: Reset form or navigate
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: 20,
        tags: []
      });
    } catch (error) {
      toast.error('Failed to add workshop');
      
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 h-screen overflow-auto">
    
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800">
          Add New Workshop
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Workshop Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min={1}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

         

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="mt-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="mt-1 bg-green-500 text-white px-4 rounded-r-md hover:bg-green-600"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 
              transition-colors flex items-center"
            >
              <Save className="mr-2" size={20} />
              Save Workshop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkshopForm;
