import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const TOKEN_VAULT_CONNECTION = process.env.REACT_APP_TOKEN_VAULT_CONNECTION;
const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const s = {
  card: {
    background: '#161616',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: '0.25rem',
  },
  agentDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 6px rgba(74,222,128,0.5)',
    animation: 'agentPulse 2s infinite',
  },
  cardTitle: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(240,236,228,0.4)',
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxHeight: 320,
    overflowY: 'auto',
    paddingRight: 4,
  },
  bubble: {
    padding: '10px 13px',
    borderRadius: 10,
    fontSize: 13,
    lineHeight: 1.55,
  },
  bubbleAgent: {
    background: 'rgba(232,213,176,0.06)',
    border: '1px solid rgba(232,213,176,0.12)',
    color: '#e8d5b0',
    borderBottomLeftRadius: 3,
  },
  bubbleUser: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(240,236,228,0.75)',
    borderBottomRightRadius: 3,
    alignSelf: 'flex-end',
    maxWidth: '88%',
  },
  bubbleLoading: {
    background: 'rgba(232,213,176,0.04)',
    border: '1px solid rgba(232,213,176,0.08)',
    color: 'rgba(232,213,176,0.4)',
    fontFamily: 'DM Mono, monospace',
    fontSize: 11,
    letterSpacing: '0.06em',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  actionBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 9,
    color: 'rgba(240,236,228,0.55)',
    fontSize: 12,
    fontFamily: 'DM Sans, sans-serif',
    padding: '8px 12px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'border-color 0.2s, color 0.2s',
  },
  actionIcon: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 10,
    color: 'rgba(232,213,176,0.4)',
    flexShrink: 0,
    width: 16,
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '1rem',
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 9,
    padding: '8px 12px',
    color: '#f0ece4',
    fontSize: 13,
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    resize: 'none',
  },
  sendBtn: {
    background: 'rgba(232,213,176,0.1)',
    border: '1px solid rgba(232,213,176,0.2)',
    borderRadius: 9,
    color: '#e8d5b0',
    fontSize: 14,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    alignSelf: 'flex-end',
    transition: 'background 0.2s',
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.05)',
  },
  sectionLabel: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 10,
    color: 'rgba(240,236,228,0.22)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  vaultStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 11px',
    background: 'rgba(74,222,128,0.05)',
    border: '1px solid rgba(74,222,128,0.15)',
    borderRadius: 8,
  },
  vaultDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#4ade80',
    flexShrink: 0,
  },
  vaultText: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 10,
    color: 'rgba(74,222,128,0.7)',
    letterSpacing: '0.06em',
  },
};

const QUICK_ACTIONS = [
  { icon: '→', label: 'Schedule my tasks in Google Calendar' },
  { icon: '→', label: 'Send me a morning briefing via Gmail' },
  { icon: '→', label: 'Suggest habits for tomorrow' },
];

const INIT_MESSAGES = [
  {
    role: 'agent',
    text: "Hi! I'm your DayAgent. I can schedule tasks in your Google Calendar, send daily briefings via Gmail, and suggest habits. What would you like to do today?",
  },
];

async function callClaude(messages, userContext) {
  const systemPrompt = `You are DayAgent, a helpful daily planning assistant. The user is logged in via Auth0.
Your capabilities:
- Suggest tasks and habits based on the user's day
- Schedule tasks into Google Calendar (via Auth0 Token Vault)
- Send daily briefing summaries via Gmail (via Auth0 Token Vault)

User context: ${JSON.stringify(userContext)}

Keep responses concise, warm, and actionable. When the user asks to schedule something or send an email, 
confirm what you'll do and describe the action clearly. In a real deployment, you would use the 
Token Vault-secured Google API tokens to actually perform these actions.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role === 'agent' ? 'assistant' : 'user',
        content: m.text,
      })),
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text || 'Sorry, I had trouble responding. Please try again.';
}

// Stub for Token Vault: in production, exchange Auth0 access token for a
// vault-secured Google token, then use it to call Google Calendar / Gmail APIs.
async function getVaultToken(auth0AccessToken, connection) {
  // POST https://{AUTH0_DOMAIN}/oauth/token with grant_type=urn:ietf:params:oauth:grant-type:token-vault
  // Returns a Google OAuth token scoped to the connection
  // See: https://auth0.com/features/token-vault
  console.log('[Token Vault] Would exchange token for connection:', connection);
  return null; // replace with real implementation
}

export default function AgentPanel({ user }) {
  const { getAccessTokenSilently } = useAuth0();
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', text: msg };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    try {
      // Get Auth0 access token (Token Vault flow starts here)
      const accessToken = await getAccessTokenSilently().catch(() => null);
      if (accessToken) {
        await getVaultToken(accessToken, TOKEN_VAULT_CONNECTION);
      }

      const userContext = { name: user?.name, email: user?.email };
      const reply = await callClaude(nextMessages, userContext);
      setMessages(m => [...m, { role: 'agent', text: reply }]);
    } catch (err) {
      setMessages(m => [...m, {
        role: 'agent',
        text: "I couldn't connect right now. Make sure your Anthropic API key is set in AgentPanel.js.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.card}>
      <style>{`
        @keyframes agentPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .action-btn:hover { border-color: rgba(232,213,176,0.25) !important; color: rgba(240,236,228,0.85) !important; }
        .send-btn:hover { background: rgba(232,213,176,0.18) !important; }
        .agent-input:focus { border-color: rgba(232,213,176,0.3) !important; }
      `}</style>

      <div style={s.header}>
        <div style={s.agentDot} />
        <span style={s.cardTitle}>AI Agent</span>
      </div>

      <div style={s.vaultStatus}>
        <div style={s.vaultDot} />
        <span style={s.vaultText}>Auth0 Token Vault · Google Calendar · Gmail</span>
      </div>

      <div style={s.messages}>
        {messages.map((m, i) => (
          <div key={i} style={{
            ...s.bubble,
            ...(m.role === 'agent' ? s.bubbleAgent : s.bubbleUser),
          }}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{ ...s.bubble, ...s.bubbleLoading }}>agent thinking...</div>
        )}
      </div>

      <div style={s.divider} />

      <span style={s.sectionLabel}>Quick actions</span>
      <div style={s.actions}>
        {QUICK_ACTIONS.map((a, i) => (
          <button key={i} style={s.actionBtn} className="action-btn" onClick={() => send(a.label)}>
            <span style={s.actionIcon}>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>

      <div style={s.inputRow}>
        <textarea
          style={s.input}
          className="agent-input"
          rows={2}
          placeholder="Ask your agent anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <button style={s.sendBtn} className="send-btn" onClick={() => send()}>↑</button>
      </div>
    </div>
  );
}