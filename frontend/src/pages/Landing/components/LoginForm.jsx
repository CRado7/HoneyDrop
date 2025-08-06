import React, { useState } from 'react';
import { useLogin } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import SkeletonLoader from '../../../components/SkeletonLoader';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, data, loading, error } = useLogin();
  const navigate = useNavigate();
  const client = useApolloClient();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        variables: { input: { email, password } },
      });

      const token = response?.data?.login?.token;
      if (token) {
        localStorage.setItem('token', token);

        // Ensure Apollo refetches user (me) query
        await client.resetStore();

        if (onSuccess) onSuccess();
        navigate('/dashboard');
      }
    } catch (err) {
      // error object already handled below
    }
  };

  // Show your skeleton loader while login is happening
  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="w-100" style={{ maxWidth: '1200px' }}>
          <SkeletonLoader />
        </div>
      </div>
    );
  }  

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <h2 className="mb-4">Login</h2>

      <div className="mb-3">
        <label htmlFor="loginEmail" className="form-label">Email</label>
        <input
          id="loginEmail"
          type="email"
          className="form-control"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="loginPassword" className="form-label">Password</label>
        <input
          id="loginPassword"
          type="password"
          className="form-control"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <div className="alert alert-danger">{error.message}</div>}

      <button type="submit" className="btn-honey w-100" disabled={loading}>
        Login
      </button>
    </form>
  );
}
