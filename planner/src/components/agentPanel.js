import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const TOKEN_VAULT_CONNECTION = process.env.REACT_APP_TOKEN_VAULT_CONNECTION;
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

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
  bubbleSuccess: {
    background: 'rgba(74,222,128,0.06)',
    border: '1px solid rgba(74,222,128,0.2)',
    color: '#4ade80',
    borderBottomLeftRadius: 3,
    fontFamily: 'DM Mono, monospace',
    fontSize: 11,
    letterSpacing: '0.04em',
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
  { icon: '→', label: 'Send me a daily briefing email' },
  { icon: '→', label: 'Email me a summary of my tasks' },
  { icon: '→', label: 'Suggest habits for tomorrow' },
];

const INIT_MESSAGES = [
  {
    role: 'agent',
    text: "Hi! I'm your DayAgent. I can send you daily briefings and task summaries via Gmail, and suggest habits. What would you like to do?",
  },
];

function makeGmailMessage(to, subject, body) {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ].join('\n');
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sendGmail(googleToken, to, subject, body) {
  const raw = makeGmailMessage(to, subject, body);
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${googleToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Gmail send failed');
  }
  return await response.json();
}

async function callGroq(messages, userContext, shouldSendEmail) {
  const systemPrompt = `You are DayAgent, a helpful daily planning assistant integrated with Gmail via Auth0 Token Vault.
The user is: ${JSON.stringify(userContext)}
Today's date: ${new Date().toDateString()}

Your capabilities:
- Send daily briefing emails via Gmail (you actually have access to do this)
- Suggest tasks and habits
- Help plan the user's day

${shouldSendEmail
  ? `IMPORTANT: The user wants to send an email. Respond with ONLY a JSON object, no other text:
{
  "sendEmail": true,
  "subject": "email subject here",
  "body": "full email body here",
  "reply": "what you say to the user after sending"
}
Make the email warm and useful. Sign it as DayAgent.`
  : `Keep responses concise, warm, and actionable. Plain text only.`}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role === 'agent' ? 'assistant' : 'user',
          content: m.text,
        })),
      ],
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';

  if (shouldSendEmail) {
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch {
      return { sendEmail: false, reply: text };
    }
  }

  return { sendEmail: false, reply: text };
}

const EMAIL_TRIGGERS = ['email', 'send', 'gmail', 'briefing', 'summary', 'mail'];

export default function AgentPanel({ user, googleToken }) {
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

    const shouldSendEmail = EMAIL_TRIGGERS.some(t => msg.toLowerCase().includes(t));

    try {
      const userContext = { name: user?.name, email: user?.email };
      const result = await callGroq(nextMessages, userContext, shouldSendEmail);

      if (result.sendEmail && googleToken && user?.email) {
        try {
          await sendGmail(googleToken, user.email, result.subject, result.body);
          setMessages(m => [
            ...m,
            { role: 'agent', text: result.reply || 'Email sent!' },
            { role: 'success', text: `✓ email sent to ${user.email}` },
          ]);
        } catch (emailErr) {
          setMessages(m => [...m, {
            role: 'agent',
            text: `I composed your email but couldn't send it: ${emailErr.message}. Make sure you signed in with Google.`,
          }]);
        }
      } else if (result.sendEmail && !googleToken) {
        setMessages(m => [...m, {
          role: 'agent',
          text: "To send emails, please sign out and sign back in using 'Continue with Google' so I can get Gmail access.",
        }]);
      } else {
        setMessages(m => [...m, { role: 'agent', text: result.reply }]);
      }
    } catch (err) {
      setMessages(m => [...m, {
        role: 'agent',
        text: "I couldn't connect right now. Check that your REACT_APP_GROQ_API_KEY is set in .env",
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
        <span style={s.vaultText}>
          Auth0 Token Vault · Gmail {googleToken ? '· connected' : '· sign in with Google to enable'}
        </span>
      </div>

      <div style={s.messages}>
        {messages.map((m, i) => (
          <div key={i} style={{
            ...s.bubble,
            ...(m.role === 'agent' ? s.bubbleAgent : m.role === 'success' ? s.bubbleSuccess : s.bubbleUser),
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