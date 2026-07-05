import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'PLAYER', gameTag: '', favoriteGame: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await registerUser(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-brand">⚡ ARENA<span style={{ color: 'var(--accent-light)' }}>X</span></div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join the community. Start competing today.</p>

        {error   && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-grid">
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input name="username" className="form-input" placeholder="AzisGG" value={form.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input name="email" type="email" className="form-input" placeholder="you@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input name="password" type="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-input" value={form.role} onChange={handleChange}>
                <option value="PLAYER">Player</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Game Tag (optional)</label>
              <input name="gameTag" className="form-input" placeholder="AzisGG#1234" value={form.gameTag} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Favorite Game (optional)</label>
              <select name="favoriteGame" className="form-input" value={form.favoriteGame} onChange={handleChange}>
                <option value="">Select game</option>
                {['BGMI','Valorant','Free Fire','CS2','FIFA','COD'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Join ArenaX'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
