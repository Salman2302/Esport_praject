import React, { useEffect, useState } from 'react';
import { getAllTournaments } from '../services/api';
import TournamentCard from '../components/TournamentCard';
import './Tournaments.css';

const GAMES   = ['All', 'BGMI', 'Valorant', 'Free Fire', 'CS2', 'FIFA', 'COD'];
const STATUSES = ['All', 'UPCOMING', 'REGISTRATION_OPEN', 'ONGOING', 'COMPLETED'];

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [game, setGame]     = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTournaments()
      .then(r => { setTournaments(r.data); setFiltered(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = [...tournaments];
    if (game   !== 'All')  list = list.filter(t => t.game === game);
    if (status !== 'All')  list = list.filter(t => t.status === status);
    if (search.trim())     list = list.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [game, status, search, tournaments]);

  return (
    <div className="tournaments-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <span className="section-label">🏆 All Events</span>
            <h1 className="page-title">Tournaments</h1>
          </div>
          <p className="page-sub">Find your next competition. Filter by game or status.</p>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <input
            className="form-input search-input"
            placeholder="Search tournament name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="filter-chips">
            {GAMES.map(g => (
              <button key={g} className={`filter-chip ${game === g ? 'active' : ''}`} onClick={() => setGame(g)}>{g}</button>
            ))}
          </div>
          <select className="form-input status-select" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
          </select>
        </div>

        {/* Results */}
        <div className="results-count">{filtered.length} tournament{filtered.length !== 1 ? 's' : ''} found</div>

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '40px' }}>🎮</p>
            <p>No tournaments match your filters.</p>
            <button className="btn-outline" onClick={() => { setGame('All'); setStatus('All'); setSearch(''); }}>Clear Filters</button>
          </div>
        ) : (
          <div className="t-grid">{filtered.map(t => <TournamentCard key={t.id} tournament={t} />)}</div>
        )}
      </div>
    </div>
  );
}
