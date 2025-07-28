import React from 'react';

export default function Signup() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Sign Up</h1>
      <form>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" />
        </div>
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}
