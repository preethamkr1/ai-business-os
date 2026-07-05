import { Bell, Search, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('agents')) return 'Agents';
    if (path.includes('automations')) return 'Automations';
    if (path.includes('copilot')) return 'Copilot';
    return 'Dashboard';
  };

  let initials = 'JD';
  try {
    const token = sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.email) {
        const namePart = payload.email.split('@')[0];
        initials = namePart.substring(0, 2).toUpperCase();
      }
    }
  } catch(e) {}

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="page-title">{getPageTitle()}</h1>
        <div className="sync-indicator">
          <span className="sync-dot"></span>
          <span className="sync-text mono">System Synced</span>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        
        <div className="user-profile">
          <div className="avatar sm">{initials}</div>
        </div>

        <button className="icon-btn danger" onClick={handleLogout}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
