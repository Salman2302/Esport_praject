import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournamentById, getTeamsByTournament, getMatchesByTournament, registerTeam } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './TournamentDetail.css';

export default function TournamentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams]   = useState([]);
  const [matches, setMatches] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag]   = useState('');
  const [regMsg, setRegMsg] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getTournamentById(id),
      getTeamsByTournament(id),
      getMatchesByTournament(id),
    ]).then(([tRes, teRes, mRes]) => {
      setTournament(tRes.data);
      setTeams(teRes.data);
      setMatches(mRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return; }
    if (!teamName.trim()) { setRegMsg('Enter team name!'); return; }
    setRegLoading(true);
    try {
      await registerTeam({ tournamentId: id, teamName, teamTag });
      setRegMsg('✅ Team registered! Waiting for approval.');
      setTeamName(''); setTeamTag('');
    } catch (e) {
      setRegMsg('❌ ' + (e.response?.data?.message || 'Registration failed'));
    } finally { setRegLoading(false); }
  };

  if (loading) return <div className="container"><div className="spinner" /></div>;
  if (!tournament) return <div className="container" style={{ padding: '60px 0', color: 'var(--text-secondary)' }}>Tournament not found.</div>;

  const { name, game, description, format, maxTeams, prizePool, registrationFee, status } = tournament;

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-hero">
        <div className="container detail-hero-inner">
          <div>
            <div className="detail-breadcrumb">
              <span onClick={() => navigate('/tournaments')} className="breadcrumb-link">Tournaments</span>
              <span> / </span>
              <span>{name}</span>
            </div>
            <h1 className="detail-title">{name}</h1>
            <div className="detail-tags">
              {game && <span className="badge badge-game">{game}</span>}
              {format && <span className="badge badge-done">{format}</span>}
              {status === 'REGISTRATION_OPEN' && <span className="badge badge-open">● Registrations Open</span>}
              {status === 'ONGOING' && <span className="badge badge-live">● Live</span>}
              {status === 'UPCOMING' && <span className="badge badge-soon">Upcoming</span>}
              {status === 'COMPLETED' && <span className="badge badge-done">Completed</span>}
            </div>
          </div>
          {prizePool && (
            <div className="detail-prize">
              <span className="prize-amount">₹{prizePool.toLocaleString()}</span>
              <span className="prize-label">Prize Pool</span>
            </div>
          )}
        </div>
      </div>

      <div className="container detail-body">
        {/* Stat row */}
        <div className="detail-stats">
          <div className="d-stat"><span className="d-stat-val">{teams.length}</span><span className="d-stat-key">Teams Registered</span></div>
          <div className="d-stat"><span className="d-stat-val">{maxTeams || '—'}</span><span className="d-stat-key">Max Teams</span></div>
          <div className="d-stat"><span className="d-stat-val">{matches.length}</span><span className="d-stat-key">Matches</span></div>
          <div className="d-stat"><span className="d-stat-val">{registrationFee || 'Free'}</span><span className="d-stat-key">Entry Fee</span></div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          {['overview', 'teams', 'matches', 'register'].map(t => (
            <button key={t} className={`detail-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'teams'   && <span className="tab-count">{teams.length}</span>}
              {t === 'matches' && <span className="tab-count">{matches.length}</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="tab-content">
            <h3 className="tab-section-title">About This Tournament</h3>
            <p className="detail-desc">{description || 'No description provided.'}</p>
          </div>
        )}

        {tab === 'teams' && (
          <div className="tab-content">
            {teams.length === 0 ? (
              <div className="empty-state"><p>No teams registered yet.</p></div>
            ) : (
              <div className="teams-table">
                <div className="teams-header">
                  <span>#</span><span>Team Name</span><span>Tag</span><span>Status</span><span>Points</span>
                </div>
                {teams.map((team, i) => (
                  <div key={team.id} className="team-row">
                    <span className="rank-num">{i + 1}</span>
                    <span className="team-name-cell">
                      <div className="team-avatar">{team.teamName?.charAt(0)}</div>
                      {team.teamName}
                    </span>
                    <span className="team-tag">{team.teamTag || '—'}</span>
                    <span className={`badge ${team.status === 'APPROVED' ? 'badge-open' : team.status === 'WINNER' ? 'badge-live' : 'badge-soon'}`}>
                      {team.status}
                    </span>
                    <span className="team-pts">{team.points || 0} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'matches' && (
          <div className="tab-content">
            {matches.length === 0 ? (
              <div className="empty-state"><p>No matches scheduled yet.</p></div>
            ) : (
              <div className="matches-list">
                {matches.map(m => (
                  <div key={m.id} className={`match-row ${m.status === 'LIVE' ? 'match-live' : ''}`}>
                    <div className="match-meta">
                      <span className="match-round">{m.round}</span>
                      <span className={`badge ${m.status === 'LIVE' ? 'badge-live' : m.status === 'COMPLETED' ? 'badge-done' : 'badge-soon'}`}>{m.status}</span>
                    </div>
                    <div className="match-teams">
                      <span className={`match-team ${m.winner?.id === m.team1?.id ? 'winner' : ''}`}>{m.team1?.teamName || 'TBD'}</span>
                      <div className="match-score">
                        <span>{m.team1Score}</span>
                        <span className="score-sep">:</span>
                        <span>{m.team2Score}</span>
                      </div>
                      <span className={`match-team text-right ${m.winner?.id === m.team2?.id ? 'winner' : ''}`}>{m.team2?.teamName || 'TBD'}</span>
                    </div>
                    {m.streamUrl && <a href={m.streamUrl} target="_blank" rel="noreferrer" className="watch-btn">▶ Watch</a>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'register' && (
          <div className="tab-content">
            {status !== 'REGISTRATION_OPEN' ? (
              <div className="empty-state"><p>Registration is currently <strong>{status?.replace('_', ' ')}</strong>.</p></div>
            ) : (
              <div className="register-form">
                <h3 className="tab-section-title">Register Your Team</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '420px' }}>
                  <div className="form-group">
                    <label className="form-label">Team Name *</label>
                    <input className="form-input" placeholder="e.g. Storm Riders" value={teamName} onChange={e => setTeamName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Team Tag (optional)</label>
                    <input className="form-input" placeholder="e.g. STR" maxLength={5} value={teamTag} onChange={e => setTeamTag(e.target.value.toUpperCase())} />
                  </div>
                  {regMsg && <p className={`reg-msg ${regMsg.includes('✅') ? 'success' : 'error'}`}>{regMsg}</p>}
                  <button className="btn-primary" onClick={handleRegister} disabled={regLoading} style={{ alignSelf: 'flex-start' }}>
                    {regLoading ? 'Registering...' : 'Register Team'}
                  </button>
                  {!user && <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>You need to <span style={{ color: 'var(--accent-light)', cursor: 'pointer' }} onClick={() => navigate('/login')}>login</span> to register.</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
