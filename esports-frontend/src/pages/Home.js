import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTournaments, getLiveMatches } from '../services/api';
import TournamentCard from '../components/TournamentCard';
import './Home.css';

const STATS = [
  { val: '2,400+', label: 'Registered Players' },
  { val: '120+',   label: 'Tournaments Held' },
  { val: '₹15L+',  label: 'Total Prize Money' },
  { val: '18+',    label: 'Games Supported' },
];

const GAMES = ['BGMI', 'Valorant', 'Free Fire', 'CS2', 'FIFA', 'COD'];

export default function Home() {
  const [tournaments, setTournaments] = useState([]);
  const [liveMatches, setLiveMatches]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllTournaments(), getLiveMatches()])
      .then(([tRes, mRes]) => {
        setTournaments(tRes.data.slice(0, 6));
        setLiveMatches(mRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="live-dot" />
            {liveMatches.length > 0 ? `${liveMatches.length} matches live right now` : 'Platform Online'}
          </div>
          <h1 className="hero-title">
            COMPETE.<br />
            <span className="hero-accent">DOMINATE.</span><br />
            CLAIM YOUR THRONE.
          </h1>
          <p className="hero-sub">
            India's most competitive esports platform. Register your team, enter tournaments, and prove you're the best.
          </p>
          <div className="hero-cta">
            <Link to="/tournaments" className="btn-primary btn-hero">Browse Tournaments</Link>
            <Link to="/register"    className="btn-outline btn-hero">Create Account</Link>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-strip">
        <div className="container stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-val">{s.val}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== LIVE MATCHES ===== */}
      {liveMatches.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">🔴 Live Now</span>
              <h2 className="section-title">Matches in Progress</h2>
            </div>
            <div className="live-grid">
              {liveMatches.map((m) => (
                <div key={m.id} className="live-card">
                  <div className="live-card-top">
                    <span className="badge badge-live">Live</span>
                    <span className="live-round">{m.round}</span>
                  </div>
                  <div className="live-teams">
                    <span className="live-team">{m.team1?.teamName || 'TBD'}</span>
                    <span className="vs-badge">VS</span>
                    <span className="live-team">{m.team2?.teamName || 'TBD'}</span>
                  </div>
                  <div className="live-score">
                    <span>{m.team1Score}</span>
                    <span className="score-sep">:</span>
                    <span>{m.team2Score}</span>
                  </div>
                  {m.streamUrl && (
                    <a href={m.streamUrl} target="_blank" rel="noreferrer" className="watch-btn">▶ Watch Live</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURED TOURNAMENTS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">🏆 Tournaments</span>
            <h2 className="section-title">Featured Events</h2>
            <Link to="/tournaments" className="section-link">View All →</Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : tournaments.length === 0 ? (
            <div className="empty-state">
              <p>No tournaments yet. Check back soon!</p>
              <Link to="/tournaments" className="btn-primary">Explore</Link>
            </div>
          ) : (
            <div className="t-grid">
              {tournaments.map((t) => <TournamentCard key={t.id} tournament={t} />)}
            </div>
          )}
        </div>
      </section>

      {/* ===== GAMES ===== */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="section-label">🎮 Games</span>
            <h2 className="section-title">Supported Titles</h2>
          </div>
          <div className="games-row">
            {GAMES.map((g) => (
              <Link key={g} to={`/tournaments?game=${g}`} className="game-pill">{g}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BAND ===== */}
      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2 className="cta-title">Ready to enter the arena?</h2>
            <p className="cta-sub">Create your account, form a team, and register for upcoming tournaments — free to start.</p>
          </div>
          <Link to="/register" className="btn-primary btn-hero">Get Started Free</Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="brand-text" style={{ fontSize: '18px' }}>ARENA<span className="brand-x">X</span></span>
          <span className="footer-copy">© 2024 ArenaX Esports Platform. Built with Java + React.</span>
        </div>
      </footer>
    </div>
  );
}
