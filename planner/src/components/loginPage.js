import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const s = {
  root: {
    minHeight: '100vh',
    background: '#0f0f0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  gridBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(232,213,176,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232,213,176,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '52px 52px',
    pointerEvents: 'none',
  },
  glow: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(232,213,176,0.06) 0%, transparent 65%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#161616',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '3rem 2.75rem 2.5rem',
    width: '100%',
    maxWidth: 420,
    position: 'relative',
    zIndex: 1,
  },
  eyebrow: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(232,213,176,0.5)',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px rgba(74,222,128,0.6)',
  },
  heading: {
    fontFamily: 'Fraunces, serif',
    fontSize: 38,
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#f0ece4',
    lineHeight: 1.15,
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
  },
  sub: {
    fontSize: 14,
    color: 'rgba(240,236,228,0.4)',
    fontWeight: 300,
    marginBottom: '2.5rem',
    lineHeight: 1.5,
  },
  btnPrimary: {
    width: '100%',
    background: '#e8d5b0',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: 10,
    padding: '13px 20px',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
    marginBottom: '0.75rem',
    letterSpacing: '0.01em',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '1.25rem 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'rgba(255,255,255,0.07)',
  },
  dividerText: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 10,
    color: 'rgba(240,236,228,0.2)',
    letterSpacing: '0.08em',
  },
  btnOauth: {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(240,236,228,0.65)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '11px 16px',
    fontSize: 13,
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
    transition: 'border-color 0.2s, background 0.2s',
  },
  features: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureIcon: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 10,
    color: 'rgba(232,213,176,0.5)',
    marginTop: 2,
    flexShrink: 0,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(240,236,228,0.35)',
    lineHeight: 1.4,
  },
};

const FEATURES = [
  { icon: '01', text: 'Daily tasks & habit tracking' },
  { icon: '02', text: 'AI-powered scheduling' },
  { icon: '03', text: 'Google Calendar sync' },
  { icon: '04', text: 'Gmail daily briefing' },
];

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  const loginGoogle = () => loginWithRedirect({
    authorizationParams: { connection: 'google-oauth2' }
  });

  return (
    <div style={s.root}>
      <style>{`
        .btn-primary:hover { opacity: 0.88; }
        .btn-primary:active { transform: scale(0.99); }
        .btn-oauth:hover { border-color: rgba(255,255,255,0.18) !important; background: rgba(255,255,255,0.06) !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeUp 0.5s ease both; }
      `}</style>

      <div style={s.gridBg} />
      <div style={s.glow} />

      <div style={s.card} className="login-card">
        <div style={s.eyebrow}>
          <div style={s.eyebrowDot} />
          DayAgent · Auth0 Token Vault
        </div>

        <h1 style={s.heading}>Plan your<br />perfect day.</h1>
        <p style={s.sub}>
          Sign in to let your AI agent schedule tasks,<br />track habits, and brief you every morning.
        </p>

        <button
          style={s.btnPrimary}
          className="btn-primary"
          onClick={() => loginWithRedirect()}
        >
          Sign in with email
        </button>

        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>or</span>
          <div style={s.dividerLine} />
        </div>

        <button style={s.btnOauth} className="btn-oauth" onClick={loginGoogle}>
          <GoogleIcon />
          Continue with Google
        </button>

        <div style={s.features}>
          {FEATURES.map(f => (
            <div key={f.icon} style={s.feature}>
              <span style={s.featureIcon}>{f.icon}</span>
              <span style={s.featureText}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063C4.14 11.53 5.91 12.938 8 12.938c1.078 0 2.004-.276 2.722-.764a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" fill="rgba(240,236,228,0.45)" />
    </svg>
  );
}