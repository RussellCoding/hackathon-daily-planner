import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import TaskList from './taskList';
import AgentPanel from './agentPanel';

const s = {
  root: {
    minHeight: '100vh',
    background: '#0f0f0f',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    position: 'sticky',
    top: 0,
    background: 'rgba(15,15,15,0.92)',
    backdropFilter: 'blur(12px)',
    zIndex: 100,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    background: 'rgba(232,213,176,0.1)',
    border: '1px solid rgba(232,213,176,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'Fraunces, serif',
    fontSize: 16,
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#e8d5b0',
    letterSpacing: '-0.01em',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'rgba(232,213,176,0.15)',
    border: '1px solid rgba(232,213,176,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'DM Mono, monospace',
    fontSize: 11,
    color: '#e8d5b0',
    fontWeight: 500,
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 7,
    color: 'rgba(240,236,228,0.4)',
    fontSize: 12,
    fontFamily: 'DM Mono, monospace',
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
    letterSpacing: '0.04em',
  },
  body: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gridTemplateRows: 'auto 1fr',
    maxWidth: 1100,
    margin: '0 auto',
    width: '100%',
    padding: '2rem',
    gap: '1.5rem',
  },
  dateBar: {
    gridColumn: '1 / -1',
  },
  dateHeading: {
    fontFamily: 'Fraunces, serif',
    fontSize: 28,
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#f0ece4',
    letterSpacing: '-0.02em',
  },
  dateSubtitle: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 11,
    color: 'rgba(240,236,228,0.3)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    minWidth: 0,
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    minWidth: 0,
  },
};

function getDateInfo() {
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return {
    day: days[now.getDay()],
    date: now.getDate(),
    month: months[now.getMonth()],
    year: now.getFullYear(),
  };
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Planner() {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const [googleToken, setGoogleToken] = useState(null);
  const d = getDateInfo();

  
useEffect(() => {
  // Try to get Google token from URL hash after OAuth redirect
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    if (token) {
      setGoogleToken(token);
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
  }
  // Fallback: try getAccessTokenSilently with Google connection
  getAccessTokenSilently({
    authorizationParams: {
      connection: 'google-oauth2',
      scope: 'https://www.googleapis.com/auth/gmail.send',
    },
  }).then(setGoogleToken).catch(() => null);
}, [getAccessTokenSilently]);

  return (
    <div style={s.root}>
      <style>{`
        .logout-btn:hover { border-color: rgba(255,255,255,0.18) !important; color: rgba(240,236,228,0.7) !important; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .planner-body { animation: fadeIn 0.4s ease both; }
      `}</style>

      <header style={s.header}>
        <div style={s.logoArea}>
          <div style={s.logoIcon}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z" stroke="#e8d5b0" strokeWidth="1.2" fill="none" />
              <circle cx="7" cy="7" r="1.8" fill="#e8d5b0" />
            </svg>
          </div>
          <span style={s.logoText}>DayAgent</span>
        </div>

        <div style={s.headerRight}>
          <div style={s.avatar}>
            {user?.picture
              ? <img src={user.picture} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : getInitials(user?.name)
            }
          </div>
          <button
            style={s.logoutBtn}
            className="logout-btn"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            sign out
          </button>
        </div>
      </header>

      <div style={s.body} className="planner-body">
        <div style={s.dateBar}>
          <h1 style={s.dateHeading}>{d.day}, {d.month} {d.date}</h1>
          <p style={s.dateSubtitle}>{d.year} · your daily command center</p>
        </div>

        <div style={s.leftCol}>
          <TaskList />
        </div>

        <div style={s.rightCol}>
          <AgentPanel user={user} googleToken={googleToken} />
        </div>
      </div>
    </div>
  );
}