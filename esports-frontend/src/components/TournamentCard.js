import React from 'react';
import { Link } from 'react-router-dom';
import './TournamentCard.css';

const GAME_ICONS = {
  'BGMI': '🎮', 'Valorant': '🔫', 'Free Fire': '🔥',
  'CS2': '💣', 'FIFA': '⚽', 'COD': '🎯', 'default': '🏆'
};

const STATUS_MAP = {
  UPCOMING: { label: 'Soon', cls: 'badge-soon' },
  REGISTRATION_OPEN: { label: '● Registering', cls: 'badge-open' },
  ONGOING: { label: '● Live', cls: 'badge-live' },
  COMPLETED: { label: 'Ended', cls: 'badge-done' },
  CANCELLED: { label: 'Cancelled', cls: 'badge-done' },
};

export default function TournamentCard({ tournament }) {
  const { id, name, game, format, maxTeams, prizePool, status, teams } = tournament;
  const statusInfo = STATUS_MAP[status] || STATUS_MAP.UPCOMING;
  const icon = GAME_ICONS[game] || GAME_ICONS.default;
  const teamCount = teams?.length || 0;
  const fillPct = maxTeams ? Math.round((teamCount / maxTeams) * 100) : 0;

  return (
    <Link to={`/tournaments/${id}`} className="t-card">
      <div className="t-card-header">
        <div className="t-game-icon">{icon}</div>
        <div className="t-card-meta">
          <span className="badge badge-game">{game || 'Multi-game'}</span>
          <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
        </div>
      </div>

      <h3 className="t-card-name">{name}</h3>

      <div className="t-card-stats">
        <div className="t-stat">
          <span className="t-stat-val">🏅 {format || 'Squad'}</span>
          <span className="t-stat-key">Format</span>
        </div>
        <div className="t-stat">
          <span className="t-stat-val">👥 {maxTeams || '—'}</span>
          <span className="t-stat-key">Max Teams</span>
        </div>
        <div className="t-stat">
          <span className="t-stat-val prize">₹{prizePool ? prizePool.toLocaleString() : '—'}</span>
          <span className="t-stat-key">Prize Pool</span>
        </div>
      </div>

      {maxTeams > 0 && (
        <div className="t-fill-bar">
          <div className="t-fill-label">
            <span>{teamCount} teams registered</span>
            <span>{fillPct}%</span>
          </div>
          <div className="t-fill-track">
            <div className="t-fill-progress" style={{ width: `${fillPct}%` }} />
          </div>
        </div>
      )}

      <div className="t-card-footer">
        <span className="t-view-link">View Details →</span>
      </div>
    </Link>
  );
}
