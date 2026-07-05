import React, { useEffect, useState } from 'react';
import { getAllTournaments, getTeamsByTournament } from '../services/api';
import './Leaderboard.css';

export default function Leaderboard() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedT, setSelectedT]    = useState(null);
  const [teams, setTeams]            = useState([]);
  const [loading, setLoading]        = useState(true);

  useEffect(() => {
    getAllTournaments().then(r => {
      const list = r.data;
      setTournaments(list);
      if (list.length > 0) {
        setSelectedT(list[0].id);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedT) return;
    getTeamsByTournament(selectedT).then(r => {
      const sorted = [...r.data].sort((a, b) => (b.points || 0) - (a.points || 0));
      setTeams(sorted);
    }).catch(() => {});
  }, [selectedT]);

  const MEDALS = ['🥇', '🥈', '🥉'];

  return (
    <div className="lb-page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="section-label">📊 Rankings</span>
            <h1 className="page-title">Leaderboard</h1>
          </div>
        </div>

        <div className="lb-select-wrap">
          <select className="form-input lb-select" value={selectedT || ''} onChange={e => setSelectedT(e.target.value)}>
            {tournaments.map(t => <option key={t.id} value={t.id}>{t.name} — {t.game}</option>)}
          </select>
        </div>

        {loading ? <div className="spinner" /> :
          teams.length === 0 ? (
            <div className="empty-state"><p>No teams yet for this tournament.</p></div>
          ) : (
            <div className="lb-table">
              <div className="lb-header">
                <span>Rank</span><span>Team</span><span>W</span><span>L</span><span>Points</span><span>Status</span>
              </div>
              {teams.map((team, i) => (
                <div key={team.id} className={`lb-row ${i === 0 ? 'lb-first' : i === 1 ? 'lb-second' : i === 2 ? 'lb-third' : ''}`}>
                  <span className="lb-rank">{MEDALS[i] || <span className="lb-num">{i + 1}</span>}</span>
                  <span className="lb-team-name">
                    <div className="team-avatar" style={{ background: i===0?'var(--gold)': i===1?'#94a3b8': i===2?'#cd7f32':'var(--accent)' }}>
                      {team.teamName?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight:700 }}>{team.teamName}</div>
                      {team.teamTag && <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{team.teamTag}</div>}
                    </div>
                  </span>
                  <span className="lb-stat green">{team.wins || 0}</span>
                  <span className="lb-stat red">{team.losses || 0}</span>
                  <span className="lb-pts">{team.points || 0}</span>
                  <span>
                    <span className={`badge ${team.status==='WINNER'?'badge-live':team.status==='APPROVED'?'badge-open':team.status==='ELIMINATED'?'badge-done':'badge-soon'}`}>
                      {team.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
