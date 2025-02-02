
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AppContext } from "../context/AppContext";

const ReviewSlider = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {backendUrl,token} = useContext(AppContext);

  // Fetch reviews using Axios
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(backendUrl+"/api/user/get-review"); // Replace with your API endpoint
        console.log("hello")
        console.log(response.data)
        setReviews(response.data.reviews || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reviews.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index) => {
    setCurrentReview(index);
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Community Says</h2>

     {/* Profile Images Row */}
<div className="flex justify-center gap-4 mb-8">
  {reviews.map((review, index)=>(
    <button
      key={review.id || index}
      onClick={() => goToReview(index)}
      className={`transition-all duration-300 text-center ${
        currentReview === index
          ? "scale-110 ring-4 ring-green-500"
          : "opacity-50 hover:opacity-75"
      }`}
    >
      <img
        src={review.image || "/api/placeholder/100/100"}
        alt={review.name}
        className="w-12 h-12 rounded-full object-cover mx-auto"
      />
      <span className="block text-sm font-semibold text-gray-800 mt-1">
        {review.name.split(" ")[0]} {/* Extracts the first name */}
      </span>
    </button>
  ))}
</div>


      {/* Reviews Slider */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentReview * 100}%)` }}
        >
          {reviews.map((review, index) => (
            <div key={review.id || index} className="w-full flex-shrink-0 p-8">
              {/* Star Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-center text-gray-600 mb-6">
                {review.review}
              </blockquote>

              {/* Reviewer Info */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-800">{review.expertName}</h4>
                <p className="text-sm text-gray-500">{review.expertRole}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevReview}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={nextReview}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToReview(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentReview === index ? "bg-green-600 w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSlider;
