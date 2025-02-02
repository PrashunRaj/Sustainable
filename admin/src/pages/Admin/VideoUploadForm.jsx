
import React, { useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const VideoUploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
    level: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);

  const { backendUrl, aToken } = useContext(AdminContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (name === 'thumbnail') {
      setThumbnail(file);
    } else if (name === 'video') {
      setVideo(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      category: '',
      level: '',
    });
    setThumbnail(null);
    setVideo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail || !video) {
      toast.error('Both thumbnail and video files are required');
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('thumbnail', thumbnail);
      uploadData.append('video', video);
      Object.keys(formData).forEach((key) => {
        uploadData.append(key, formData[key]);
      });



      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-video`,
        uploadData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    
    }
  };

  return (
    <div className="h-screen p-4 flex flex-col">
      <div className="w-full max-w-6xl mx-auto flex-1 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 my-4">
          <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-white pt-2">
            Upload Video
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Thumbnail
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Video File
                </label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 45 mins"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Environment"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
            >
              Upload Video
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadForm;
