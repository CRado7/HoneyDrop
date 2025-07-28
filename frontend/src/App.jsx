import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <ProtectedRoute>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:siteId/:pageId" element={<Editor />} />
      </ProtectedRoute>
    </Routes>
  );
}
