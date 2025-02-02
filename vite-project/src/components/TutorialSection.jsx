

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Play, Clock, BookOpen, ChevronRight, X } from "lucide-react";
import { AppContext } from "../context/AppContext";

import SkeletonLoader from "./SkeletonLoader";

const TutorialSection = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        console.log("heyyy")
        const response = await axios.get(`${backendUrl}/api/user/get-all-videos`);
        console.log("heyyy2")
        setTutorials(response.data.videos || []);
        setTimeout(() => {
          setTutorials(response.data.videos || []);
          setLoading(false); // Stop loading after delay
        }, 5000);
        //setLoading(false);
      } catch (err) {
        setError("Failed to load videos. Please try again.");
        setLoading(false);
      }
    };

    fetchVideos();
  }, [backendUrl]);

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePlayClick = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const closeModal = (event) => {
    event.stopPropagation();
    setSelectedVideo(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Learn Sustainable Practices
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our comprehensive tutorials and video lessons on various aspects of sustainability and environmental management.
        </p>
      </div>

      {/* Loading State */}
      {loading && <SkeletonLoader />} {/* Show SkeletonLoader while loading */}

      {/* Error State */}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Tutorials Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className="relative group cursor-pointer"
                onClick={() => handlePlayClick(tutorial.videoUrl)}
              >
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-16 h-16 text-white opacity-80" />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{tutorial.category}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                      tutorial.level
                    )}`}
                  >
                    {tutorial.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{tutorial.description}</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span className="text-sm">{tutorial.lessons} lessons</span>
                  </div>
                </div>
                <button
                  onClick={() => handlePlayClick(tutorial.videoUrl)}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  Explore This
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedVideo(null)} // Allow closing by clicking outside modal
        >
          <div
            className="bg-white rounded-lg overflow-hidden shadow-lg w-11/12 md:w-3/4 lg:w-1/2 relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialSection;
