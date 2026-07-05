import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getAllUsers, changeUserRole, getAllTournaments, updateTournamentStatus } from '../services/api';
import './Admin.css';

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]           = useState(null);
  const [users, setUsers]           = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    Promise.all([getAdminStats(), getAllUsers(), getAllTournaments()])
      .then(([sRes, uRes, tRes]) => {
        setStats(sRes.data);
        setUsers(uRes.data);
        setTournaments(tRes.data);
      }).catch(() => {}).finally(() => setLoading(false));
  }, [isAdmin, navigate]);

  const handleRoleChange = async (userId, role) => {
    try {
      await changeUserRole(userId, role);
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
    } catch {}
  };

  const handleStatusChange = async (tournamentId, status) => {
    try {
      await updateTournamentStatus(tournamentId, status);
      setTournaments(tournaments.map(t => t.id === tournamentId ? { ...t, status } : t));
    } catch {}
  };

  if (loading) return <div className="container"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="section-label">⚙ Admin Panel</span>
            <h1 className="page-title">Control Center</h1>
          </div>
          <span className="badge badge-live">Admin Access</span>
        </div>

        <div className="dash-tabs">
          {['stats','users','tournaments'].map(t => (
            <button key={t} className={`detail-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'stats' && stats && (
          <div className="admin-stats-grid">
            {[
              { icon:'👤', val: stats.totalUsers,       label:'Total Users' },
              { icon:'🏆', val: stats.totalTournaments, label:'Tournaments' },
              { icon:'👥', val: stats.totalTeams,       label:'Teams' },
              { icon:'⚔️', val: stats.totalMatches,     label:'Matches' },
              { icon:'🔴', val: stats.liveMatches,      label:'Live Now', highlight: true },
            ].map(s => (
              <div key={s.label} className={`card stat-admin ${s.highlight ? 'stat-live' : ''}`}>
                <div className="stat-admin-icon">{s.icon}</div>
                <div className="stat-admin-val">{s.val}</div>
                <div className="stat-admin-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Game</th><th>Status</th><th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="muted">{u.id}</td>
                    <td className="bold">{u.username}</td>
                    <td className="muted">{u.email}</td>
                    <td><span className={`badge ${u.role==='ADMIN'?'badge-live':u.role==='ORGANIZER'?'badge-soon':'badge-open'}`}>{u.role}</span></td>
                    <td className="muted">{u.favoriteGame || '—'}</td>
                    <td><span className={`badge ${u.active?'badge-open':'badge-done'}`}>{u.active?'Active':'Inactive'}</span></td>
                    <td>
                      {u.id !== user?.userId && (
                        <select className="form-input role-select" value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}>
                          <option value="PLAYER">Player</option>
                          <option value="ORGANIZER">Organizer</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'tournaments' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Game</th><th>Teams</th><th>Prize</th><th>Status</th><th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map(t => (
                  <tr key={t.id}>
                    <td className="muted">{t.id}</td>
                    <td className="bold">{t.name}</td>
                    <td><span className="badge badge-game">{t.game}</span></td>
                    <td className="muted">{t.teams?.length || 0}/{t.maxTeams}</td>
                    <td style={{ color:'var(--gold)' }}>₹{t.prizePool?.toLocaleString() || '—'}</td>
                    <td>
                      <span className={`badge ${
                        t.status==='REGISTRATION_OPEN'?'badge-open':
                        t.status==='ONGOING'?'badge-live':
                        t.status==='COMPLETED'?'badge-done':'badge-soon'
                      }`}>{t.status?.replace('_',' ')}</span>
                    </td>
                    <td>
                      <select className="form-input role-select" value={t.status} onChange={e => handleStatusChange(t.id, e.target.value)}>
                        <option value="UPCOMING">UPCOMING</option>
                        <option value="REGISTRATION_OPEN">REGISTRATION OPEN</option>
                        <option value="ONGOING">ONGOING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
