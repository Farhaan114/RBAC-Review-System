import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Regular Expressions for validation
  const usernameRegex = /^[a-zA-Z0-9]{3,15}$/; // Alphanumeric, 3-15 characters
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, 1 letter, 1 number

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validation checks
    if (!usernameRegex.test(formData.username)) {
      setError('Username must be alphanumeric and between 3 to 15 characters');
      toast.error('Invalid username');
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters, with 1 letter and 1 number');
      toast.error('Invalid password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      setMessage(response.data.message);
      toast.success(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      toast.error("error!");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="register-container">
      
      <div className="register-box">
      <button onClick={() => navigate("/")} className="back-button">Back to login</button>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
