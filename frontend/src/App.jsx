import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import CompleteProfile from './pages/CompleteProfile';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor/Editor';
import ProtectedRoutes from './components/ProtectedRoutes';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/login" element={<Login />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        {/* <Sidebar /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:userId/:siteName" element={<Editor />} />
      </Route>
    </Routes>
  );
}
