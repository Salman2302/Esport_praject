import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTeams, getMyTournaments, createTournament } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user, isOrganizer } = useAuth();
  const [teams, setTeams]           = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [tab, setTab] = useState('overview');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name:'', game:'BGMI', description:'', format:'Squad', maxTeams:16, prizePool:'', registrationFee:'Free' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user?.role === 'PLAYER') {
      getMyTeams().then(r => setTeams(r.data)).catch(() => {});
    }
    if (isOrganizer) {
      getMyTournaments().then(r => setMyTournaments(r.data)).catch(() => {});
    }
  }, [user, isOrganizer]);

  const handleCreate = async () => {
    try {
      await createTournament({ ...form, maxTeams: parseInt(form.maxTeams), prizePool: parseInt(form.prizePool) || 0 });
      setMsg('✅ Tournament created!');
      setShowCreate(false);
      getMyTournaments().then(r => setMyTournaments(r.data)).catch(() => {});
    } catch (e) {
      setMsg('❌ Failed: ' + (e.response?.data?.message || 'Error'));
    }
  };

  return (
    <div className="dash-page">
      <div className="container">
        {/* Header */}
        <div className="dash-header">
          <div className="dash-welcome">
            <div className="dash-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 className="dash-title">Welcome back, {user?.username}!</h1>
              <p className="dash-role-tag">{user?.role} {user?.gameTag && `• ${user.gameTag}`} {user?.favoriteGame && `• ${user.favoriteGame}`}</p>
            </div>
          </div>
          {isOrganizer && (
            <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? '✕ Cancel' : '+ Create Tournament'}
            </button>
          )}
        </div>

        {/* Create Tournament Form */}
        {showCreate && (
          <div className="create-form card">
            <h3 className="tab-section-title" style={{ marginBottom: '20px' }}>New Tournament</h3>
            <div className="create-grid">
              {[
                { label:'Tournament Name *', name:'name', placeholder:'e.g. BGMI Champions League' },
                { label:'Game *', name:'game', type:'select', options:['BGMI','Valorant','Free Fire','CS2','FIFA','COD'] },
                { label:'Format', name:'format', type:'select', options:['Solo','Duo','Squad','5v5','11v11'] },
                { label:'Max Teams', name:'maxTeams', type:'number', placeholder:'16' },
                { label:'Prize Pool (₹)', name:'prizePool', type:'number', placeholder:'10000' },
                { label:'Registration Fee', name:'registrationFee', placeholder:'Free / ₹100' },
              ].map(f => (
                <div key={f.name} className="form-group">
                  <label className="form-label">{f.label}</label>
                  {f.type === 'select' ? (
                    <select name={f.name} className="form-input" value={form[f.name]} onChange={e => setForm({...form, [f.name]: e.target.value})}>
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input name={f.name} type={f.type || 'text'} className="form-input" placeholder={f.placeholder} value={form[f.name]} onChange={e => setForm({...form, [f.name]: e.target.value})} />
                  )}
                </div>
              ))}
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Tournament details..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ resize:'vertical' }} />
              </div>
            </div>
            {msg && <p style={{ fontSize:'13px', marginTop:'8px', color: msg.includes('✅') ? 'var(--green)' : 'var(--red)' }}>{msg}</p>}
            <button className="btn-primary" onClick={handleCreate} style={{ marginTop:'16px' }}>Create Tournament</button>
          </div>
        )}

        {/* Tabs */}
        <div className="dash-tabs">
          <button className={`detail-tab ${tab==='overview'?'active':''}`} onClick={() => setTab('overview')}>Overview</button>
          {user?.role === 'PLAYER' && (
            <button className={`detail-tab ${tab==='teams'?'active':''}`} onClick={() => setTab('teams')}>
              My Teams <span className="tab-count">{teams.length}</span>
            </button>
          )}
          {isOrganizer && (
            <button className={`detail-tab ${tab==='tournaments'?'active':''}`} onClick={() => setTab('tournaments')}>
              My Tournaments <span className="tab-count">{myTournaments.length}</span>
            </button>
          )}
        </div>

        {tab === 'overview' && (
          <div className="dash-overview">
            <div className="overview-cards">
              {user?.role === 'PLAYER' && (
                <div className="card ov-card">
                  <div className="ov-icon">👥</div>
                  <div className="ov-val">{teams.length}</div>
                  <div className="ov-label">Teams Joined</div>
                </div>
              )}
              {isOrganizer && (
                <div className="card ov-card">
                  <div className="ov-icon">🏆</div>
                  <div className="ov-val">{myTournaments.length}</div>
                  <div className="ov-label">Tournaments Organized</div>
                </div>
              )}
              <div className="card ov-card">
                <div className="ov-icon">🎮</div>
                <div className="ov-val">{user?.favoriteGame || '—'}</div>
                <div className="ov-label">Main Game</div>
              </div>
              <div className="card ov-card">
                <div className="ov-icon">🏷️</div>
                <div className="ov-val" style={{ fontSize:'16px' }}>{user?.gameTag || '—'}</div>
                <div className="ov-label">Game Tag</div>
              </div>
            </div>
            <div style={{ marginTop:'28px' }}>
              <Link to="/tournaments" className="btn-primary">Browse Tournaments →</Link>
            </div>
          </div>
        )}

        {tab === 'teams' && (
          <div>
            {teams.length === 0 ? (
              <div className="empty-state">
                <p>You haven't registered for any tournament yet.</p>
                <Link to="/tournaments" className="btn-primary">Find a Tournament</Link>
              </div>
            ) : (
              <div className="dash-teams-grid">
                {teams.map(t => (
                  <Link key={t.id} to={`/tournaments/${t.tournament?.id}`} className="card dash-team-card">
                    <div className="dash-team-header">
                      <div className="team-avatar">{t.teamName?.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'15px' }}>{t.teamName}</div>
                        {t.teamTag && <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{t.teamTag}</div>}
                      </div>
                    </div>
                    <div style={{ fontSize:'13px', color:'var(--text-secondary)', marginTop:'8px' }}>
                      🏆 {t.tournament?.name || 'Tournament'}
                    </div>
                    <span className={`badge ${t.status==='APPROVED'?'badge-open':t.status==='WINNER'?'badge-live':'badge-soon'}`} style={{ marginTop:'10px' }}>{t.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'tournaments' && (
          <div>
            {myTournaments.length === 0 ? (
              <div className="empty-state">
                <p>No tournaments created yet.</p>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>Create One</button>
              </div>
            ) : (
              <div className="dash-teams-grid">
                {myTournaments.map(t => (
                  <Link key={t.id} to={`/tournaments/${t.id}`} className="card dash-team-card">
                    <div style={{ fontWeight:700, fontSize:'16px', marginBottom:'6px' }}>{t.name}</div>
                    <span className="badge badge-game">{t.game}</span>
                    <div style={{ fontSize:'13px', color:'var(--text-secondary)', marginTop:'8px' }}>
                      {t.teams?.length || 0} teams • {t.format}
                    </div>
                    <div style={{ marginTop:'8px' }}>
                      <span className={`badge ${t.status==='REGISTRATION_OPEN'?'badge-open':t.status==='ONGOING'?'badge-live':t.status==='COMPLETED'?'badge-done':'badge-soon'}`}>
                        {t.status?.replace('_',' ')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
