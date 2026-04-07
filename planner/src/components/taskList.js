import React, { useState } from 'react';

const s = {
  card: {
    background: '#161616',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  cardTitle: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(240,236,228,0.4)',
  },
  count: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 11,
    color: 'rgba(232,213,176,0.5)',
    background: 'rgba(232,213,176,0.08)',
    padding: '2px 8px',
    borderRadius: 99,
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    marginBottom: '1rem',
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 9,
    padding: '9px 12px',
    color: '#f0ece4',
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  addBtn: {
    background: 'rgba(232,213,176,0.1)',
    border: '1px solid rgba(232,213,176,0.2)',
    borderRadius: 9,
    color: '#e8d5b0',
    fontSize: 18,
    width: 38,
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
    flexShrink: 0,
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    border: '1.5px solid rgba(255,255,255,0.15)',
    flexShrink: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s, border-color 0.15s',
  },
  checkboxDone: {
    background: '#4ade80',
    borderColor: '#4ade80',
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: '#f0ece4',
    transition: 'opacity 0.2s',
  },
  taskTextDone: {
    opacity: 0.3,
    textDecoration: 'line-through',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(240,236,228,0.2)',
    fontSize: 16,
    cursor: 'pointer',
    padding: '0 4px',
    lineHeight: 1,
    transition: 'color 0.15s',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem 0',
    color: 'rgba(240,236,228,0.18)',
    fontSize: 13,
    fontFamily: 'DM Mono, monospace',
    letterSpacing: '0.06em',
  },
  agentAdded: {
    fontFamily: 'DM Mono, monospace',
    fontSize: 9,
    color: 'rgba(74,222,128,0.5)',
    letterSpacing: '0.06em',
    marginLeft: 2,
  },
};

export default function TaskList({ tasks, setTasks }) {
  const [input, setInput] = useState('');

  const add = () => {
    if (!input.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  };

  const toggle = id => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const remove = id => setTasks(t => t.filter(x => x.id !== id));
  const remaining = tasks.filter(t => !t.done).length;

  return (
    <div style={s.card}>
      <style>{`
        .task-input:focus { border-color: rgba(232,213,176,0.35) !important; }
        .add-btn:hover { background: rgba(232,213,176,0.18) !important; }
        .delete-btn:hover { color: rgba(248,113,113,0.7) !important; }
        .checkbox-wrap:hover { border-color: rgba(74,222,128,0.5) !important; }
        @keyframes taskSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .task-new { animation: taskSlideIn 0.25s ease both; }
      `}</style>

      <div style={s.cardHeader}>
        <span style={s.cardTitle}>Tasks</span>
        <span style={s.count}>{remaining} left</span>
      </div>

      <div style={s.inputRow}>
        <input
          style={s.input}
          className="task-input"
          placeholder="Add a task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button style={s.addBtn} className="add-btn" onClick={add}>+</button>
      </div>

      {tasks.length === 0 && (
        <div style={s.empty}>no tasks yet</div>
      )}

      {tasks.map(task => (
        <div key={task.id} style={s.taskItem} className={task.agentAdded ? 'task-new' : ''}>
          <div
            style={{ ...s.checkbox, ...(task.done ? s.checkboxDone : {}) }}
            className="checkbox-wrap"
            onClick={() => toggle(task.id)}
          >
            {task.done && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#0f0f0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ ...s.taskText, ...(task.done ? s.taskTextDone : {}) }}>
            {task.text}
            {task.agentAdded && <span style={s.agentAdded}> · agent</span>}
          </span>
          <button style={s.deleteBtn} className="delete-btn" onClick={() => remove(task.id)}>×</button>
        </div>
      ))}
    </div>
  );
}