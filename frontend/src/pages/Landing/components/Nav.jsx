// src/components/Navbar.jsx
export default function Navbar({ onLoginClick }) {
    return (
      <nav className="navbar navbar-expand-lg bg-butter-beige px-4 py-3 shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand text-bee fw-bold" href="/">Honeydrop</a>
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={onLoginClick}>
              Login / Signup
            </button>
          </div>
        </div>
      </nav>
    );
  }
  
