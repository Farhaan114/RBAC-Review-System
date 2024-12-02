import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import './reviews.css';

export const MyReviews = () => {
  const { user } = useContext(AuthContext); // Get logged-in user details
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);

  // Fetch reviews for the logged-in user
  useEffect(() => {
    if (!user) return; // If no user is logged in, skip fetching reviews

    const token = localStorage.getItem('token'); // Get the token from localStorage
    axios
      .get('http://localhost:5000/api/reviews/me', {
        headers: { Authorization: `Bearer ${token}` }, // Pass token in the headers
      })
      .then(({ data }) => {
        setReviews(data.reviews); // Populate the reviews from the server response
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to fetch reviews');
      });
  }, [user]);

  const startEditing = (review) => {
    setEditingReview(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const updateReview = (reviewId) => {
    // Regex to allow only letters, numbers, spaces, and basic punctuation
    const commentRegex = /^[a-zA-Z0-9\s.,!?]*$/;

    // Check if the comment matches the regex
    if (!commentRegex.test(editComment)) {
      toast.error('Comment contains invalid characters');
      return;
    }

    const token = localStorage.getItem('token'); // Get the token from localStorage
    axios
      .put(
        `http://localhost:5000/api/reviews/${reviewId}`,
        {
          comment: editComment,
          rating: editRating,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
        }
      )
      .then(() => {
        toast.success('Review updated');
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? { ...review, comment: editComment, rating: editRating }
              : review
          )
        );
        setEditingReview(null);
      })
      .catch(() => toast.error('Failed to update review'));
  };

  return (
    <div className="my-reviews-container">
      <h1 className="my-reviews-title">My Reviews</h1>
      <div className="my-reviews-table-container">
        <div className="my-reviews-scrollable-table">
          <table className="my-reviews-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Comment</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.product_name}</td>
                    <td>
                      {editingReview === review.id ? (
                        <input
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="comment-input"
                        />
                      ) : (
                        review.comment
                      )}
                    </td>
                    <td>
                      {editingReview === review.id ? (
                        <div className="star-rating">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              style={{
                                color: index < editRating ? '#FFD700' : '#ccc',
                                cursor: 'pointer',
                              }}
                              onClick={() => setEditRating(index + 1)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="star-rating">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              style={{
                                color: index < review.rating ? '#FFD700' : '#ccc',
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="my-reviews-buttons">
                        {editingReview === review.id ? (
                          <>
                            <button
                              onClick={() => updateReview(review.id)}
                              className="save-button"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingReview(null)}
                              className="cancel-button"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditing(review)}
                            className="edit-button"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No reviews found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
