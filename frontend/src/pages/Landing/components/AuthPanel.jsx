// src/components/AuthPanel.jsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthPanel({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login');

  return (
    <div className="container my-4 p-3" style={{ maxWidth: '420px' }}>
      <div className="d-flex justify-content-between mb-3">
        <button
          className={`btn flex-fill me-2 ${mode === 'login' ? 'btn-warning' : 'btn-outline-warning'}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={`btn flex-fill ms-2 ${mode === 'signup' ? 'btn-warning' : 'btn-outline-warning'}`}
          onClick={() => setMode('signup')}
        >
          Signup
        </button>
      </div>

      <div className="position-relative overflow-hidden" style={{ height: '400px' }}>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            transform: mode === 'login' ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.5s ease',
          }}
        >
          <LoginForm onSuccess={onSuccess} />
        </div>

        <div
          className="position-absolute top-0 start-100 w-100 h-100"
          style={{
            transform: mode === 'signup' ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 0.5s ease',
          }}
        >
          <SignupForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
