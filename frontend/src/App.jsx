import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Agents from './pages/Dashboard/Agents';
import Automations from './pages/Dashboard/Automations';
import Copilot from './pages/Copilot/Copilot';
import Startup from './pages/Dashboard/Startup';
import FeedbackInbox from './pages/Dashboard/FeedbackInbox';
import Marketing from './pages/Dashboard/Marketing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/startup" element={<Startup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/feedback" element={<FeedbackInbox />} />
          <Route path="/marketing" element={<Marketing />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
