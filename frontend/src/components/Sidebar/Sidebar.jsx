import React, { useState } from 'react';
import { useCurrentUser } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Spinner, Form } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css'; // we’ll create this next

const Sidebar = () => {
  const { user, loading, error } = useCurrentUser();
  const { dark, toggleDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return <div className="p-3"><Spinner animation="border" size="sm" /></div>;
  if (error) return <div className="p-3 text-danger">Error loading user</div>;

  return (
    <>
      {/* Toggle Button */}
      <button
        className="btn btn-dark d-md-none position-fixed m-2"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ zIndex: 1050 }}
      >
        <List size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar d-flex flex-column p-3 ${
          isOpen ? 'slide-in' : 'slide-out'
        } ${dark ? 'bg-dark text-white' : 'bg-light text-dark'}`}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Link to="/profile" className="text-decoration-none fw-bold text-reset">
            <img
              src="/default-avatar.png"
              alt="Avatar"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            {user?.name || 'User'}
          </Link>

          {/* Theme Switch */}
          <Form.Check
            type="switch"
            id="dark-mode-toggle"
            label="🌙"
            checked={dark}
            onChange={toggleDark}
            className="ms-auto"
          />
        </div>

        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link active text-reset">
              Dashboard
            </Link>
          </li>
          {/* Add more nav items here */}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
