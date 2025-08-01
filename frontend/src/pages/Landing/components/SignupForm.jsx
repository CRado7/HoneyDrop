import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../../hooks/useAuth';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, data, loading, error } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ variables: { input: { name, email, password } } });

      // Redirect to /complete-profile with the entered data
      navigate('/complete-profile', {
        state: { name, email, password }
      });
    } catch (err) {
      // error shown below
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <h2 className="mb-4">Sign Up</h2>

      <div className="mb-3">
        <label htmlFor="signupName" className="form-label">Name</label>
        <input
          id="signupName"
          type="text"
          className="form-control"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="signupEmail" className="form-label">Email</label>
        <input
          id="signupEmail"
          type="email"
          className="form-control"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="signupPassword" className="form-label">Password</label>
        <input
          id="signupPassword"
          type="password"
          className="form-control"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <div className="alert alert-danger">{error.message}</div>}

      <button type="submit" className="btn btn-success w-100" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
