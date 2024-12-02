import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from './AuthContext';
import './Login.css'; // Import the custom CSS

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access `login` function from AuthContext

  // Regular Expressions for validation
  const usernameRegex = /^[a-zA-Z0-9]{3,15}$/; // Alphanumeric, 3-15 characters
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, 1 letter, 1 number

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!usernameRegex.test(username)) {
      toast.error('Invalid username. Must be alphanumeric and between 3 to 15 characters.');
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error('Invalid password. Must be at least 8 characters, with 1 letter and 1 number.');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/login', { username, password });

      // Save token and role in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('id', data.userId);

      // Update the AuthContext user state
      login({ name: data.name, role: data.role, id: data.userId });

      // Navigate to the products page
      navigate("/products");
    } catch (error) {
      console.error('Login failed:', error.response?.data || error);
      toast.error("Login failed. User not found!");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{display:"flex", justifyContent:"center"}}>
            <button type="submit">Login</button>
          </div>
        </form>
        <div className="register-link">
          <h3>New User? Register here</h3>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
