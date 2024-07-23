import React, { useState } from 'react';
import axios from 'axios';
import StarRating from './Star';
import { useAuth } from "../../context/auth";
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const baseurl = process.env.REACT_APP_BASE_URL;

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const params = useParams();

  const [auth] = useAuth();
  const token = auth?.token;
  const role = auth?.user?.role

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseurl}/product/create-review/${params.slug}`, {
        rating,
        comment
      }, {
        headers: {
          Authorization: token
        }
      });
      console.log('Review submitted:', response.data);
      toast.success("Review Submitted");
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error.message);
      toast.error("Error submitting review");
    }
  };

  return (
    <> 
    {
      token && role === "Client" && (
        <form onSubmit={submitReview} className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6 mt-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Leave a Review</h2>
        <div className="mb-6">
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div className="mb-6">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-800 transition duration-300 resize-none shadow-sm hover:shadow-md"
            rows="5"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-6 bg-pink-800 text-white font-semibold rounded-md hover:bg-pink-900 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Submit Review
        </button>
      </form>

      )
    }
</>
  );
};

export default ReviewForm;
