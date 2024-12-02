import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext';
import { FaStar } from 'react-icons/fa';
import './ProductDetails.css';

export const ProductDetails = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setProduct(data))
      .catch(() => toast.error('Failed to fetch product details'));

    axios
      .get(`http://localhost:5000/api/products/${productId}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setReviews(data))
      .catch(() => toast.error('Failed to fetch reviews'));
  }, [productId]);

  const addReview = () => {
    const { comment, rating } = newReview;

    // Regex to validate comment (non-empty and no special characters)
    const commentRegex = /^[a-zA-Z0-9\s.,!?'-]*$/;
    if (!comment || !commentRegex.test(comment)) {
      toast.error('Invalid comment. Please enter a valid comment.');
      return;
    }

    // Check if rating is within range (1-5)
    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5.');
      return;
    }

    const token = localStorage.getItem('token');

    axios
      .post(
        `http://localhost:5000/api/products/${productId}/reviews`,
        newReview,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success('Review added');
        setNewReview({ rating: '', comment: '' });
        setTimeout(() => window.location.reload(), 2000); // Reload after 2 seconds
      })
      .catch(() => toast.error('Failed to add review'));
  };

  const deleteReview = (reviewId) => {
    const token = localStorage.getItem('token');

    axios
      .delete(`http://localhost:5000/api/reviews/${reviewId}/moderator`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success('Review deleted');
        setReviews(reviews.filter((review) => review.id !== reviewId));
        setTimeout(() => window.location.reload(), 2000); // Reload after 2 seconds
      })
      .catch(() => toast.error('Failed to delete review'));
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  return (
    <div className="center-box">
      <div className="glass-effect-p">
        <div>
          <h2>{product.name}</h2>
          <i>{product.description}</i>
          <p>Price: ${product.price}</p>
          <h3>Reviews</h3>
          <div className="scrollable-section">
            <ul>
              {reviews.map((review) => (
                <li key={review.id}> {/* Use review.id as the unique key */}
                  <strong>{review.username}</strong> ({new Date(review.timestamp).toLocaleString()}):<br />
                  <em>{review.comment}</em><br />
                  <div className="star-container">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        style={{
                          color: index < review.rating ? '#FFD700' : '#ccc',
                        }}
                      />
                    ))}
                  </div>
                  {user && (user.role === 'admin' || user.role === 'moderator') && (
                    <button className="btn" onClick={() => deleteReview(review.id)}>
                      Delete Inappropriate review
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h4>Add a Review</h4>
        <input
          type="text"
          placeholder="Comment"
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
        />
        <div className="star-container">
          Your Rating: {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              style={{ color: index < newReview.rating ? '#FFD700' : '#ccc', cursor: 'pointer' }}
              onClick={() => handleRatingChange(index + 1)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <button className="rbtn" onClick={addReview}>Submit</button>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
