import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Leaderboard from './pages/Leaderboard';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/tournaments"       element={<Tournaments />} />
          <Route path="/tournaments/:id"   element={<TournamentDetail />} />
          <Route path="/leaderboard"       element={<Leaderboard />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/dashboard"         element={<Dashboard />} />
          <Route path="/admin"             element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
