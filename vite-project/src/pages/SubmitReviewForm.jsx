

import React, { useContext, useState } from 'react';
import { Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const SubmitReviewForm = () => {
  const {userId, expertId,ExpertName,Role,image} = useParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    review: '',
    wouldRecommend: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const{token,backendUrl}=useContext(AppContext)

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit the review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
    
     
      const forMData=new FormData();
      forMData.append('expertId',expertId);
      forMData.append('rating',rating);
      forMData.append('userId',userId); 
      forMData.append('title',formData.title)
      forMData.append('review',formData.review)
      forMData.append('wouldRecommend',formData.wouldRecommend)
      console.log(forMData)
      const payload = {
        expertId,
        userId,
        rating,
        title: formData.title,
        review: formData.review,
        wouldRecommend: formData.wouldRecommend,
      };
      for (let [key, value] of forMData.entries()){
        console.log(key, value);
      }

      const {data}= await axios.post(backendUrl+'/api/user/add-review',payload
       
        
      
      ,{headers:{token}});
    //  console.log(response);
     console.log("hello2")
      if (data.success) {
        toast.success('Review submitted successfully!');
        // Reset form
        setFormData({
          title: '',
          review: '',
          wouldRecommend: false,
        });
        setRating(0);
      } else {
        toast.error(data.message || 'Failed to submit the review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
       

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Details */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Summarize your experience(min 10 char)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Share your experience with this expert..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="recommend"
                name="wouldRecommend"
                checked={formData.wouldRecommend}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="recommend" className="ml-2 text-sm text-gray-700">
                I would recommend this expert to others
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !rating}
            className={`w-full py-3 px-4 rounded-md text-white font-medium 
              ${isSubmitting || !rating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
              } transition-colors`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReviewForm;
