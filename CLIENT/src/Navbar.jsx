import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './navbar.css';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear user state and localStorage
    navigate('/'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <NavLink className="navbar-brand" to="/">
            RBAC Review System
          </NavLink>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                to="/products"
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                to="/myreviews"
              >
                My Reviews
              </NavLink>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  to="/admin"
                >
                  For Admins
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <div className="navbar-right">
        {user && <span className="navbar-text">Welcome, {user.role}</span>}

          {user && (
            <button
              className="nav-link btn btn-link"
              style={{ textDecoration: 'none' }}
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
