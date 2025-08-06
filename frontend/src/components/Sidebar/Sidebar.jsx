import React from 'react';
import { useCurrentUser } from '../../hooks/useAuth';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { Spinner, Form } from 'react-bootstrap';
import { House, Gear, Person, BoxArrowRight, WindowStack } from 'react-bootstrap-icons';
import { useTheme } from '../../context/themeContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, loading, error } = useCurrentUser();
  const { dark, toggleDark } = useTheme();
  const { logout } = useAuth();
const navigate = useNavigate();


  if (loading) return <div className="p-3"><Spinner animation="border" size="sm" /></div>;
  if (error) return <div className="p-3 text-danger">Error loading user</div>;

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${dark ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
        <Link to="/profile" className="profile">
          <img
            src="/default-avatar.png"
            alt="Avatar"
            className="rounded-circle"
            width="40"
            height="40"
          />
          <span className="fw-bold">{user?.name || 'User'}</span>
        </Link>

        {/* Theme Switch */}
        <div className="px-3 mb-3">
          <Form.Check
            type="switch"
            id="dark-mode-toggle"
            label="🌙"
            checked={dark}
            onChange={toggleDark}
          />
        </div>

        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <House />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/account" className="nav-link">
              <Person />
              <span>My Account</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/websites" className="nav-link">
              <WindowStack />
              <span>Templates</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link">
              <Gear />
              <span>Settings</span>
            </Link>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link text-start w-100"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <BoxArrowRight />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;