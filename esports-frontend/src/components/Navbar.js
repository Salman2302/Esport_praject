import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">ARENA<span className="brand-x">X</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/"            className={`nav-link ${isActive('/')}`}            onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/tournaments" className={`nav-link ${isActive('/tournaments')}`} onClick={() => setMenuOpen(false)}>Tournaments</Link>
          <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard')}`} onClick={() => setMenuOpen(false)}>Leaderboard</Link>
          {user && (
            <Link to="/dashboard"  className={`nav-link ${isActive('/dashboard')}`}  onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link to="/admin"      className={`nav-link nav-admin ${isActive('/admin')}`} onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <div className="user-avatar">{user.username?.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <button className="btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login"    className="btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn-primary btn-sm">Join Now</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
