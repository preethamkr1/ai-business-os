import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Zap, Bot, Settings, MessageSquare, Megaphone } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="brand">Growth OS</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/startup" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Bot size={20} />
          <span>Startup</span>
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/marketing" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Megaphone size={20} />
          <span>Marketing</span>
        </NavLink>
        <NavLink to="/agents" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Users size={20} />
          <span>Agents</span>
        </NavLink>
        <NavLink to="/automations" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Zap size={20} />
          <span>Automations</span>
        </NavLink>
        <NavLink to="/feedback" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <MessageSquare size={20} />
          <span>Feedback Inbox</span>
        </NavLink>
        <NavLink to="/copilot" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Bot size={20} />
          <span>Copilot</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="workspace-card">
          <div className="avatar">JD</div>

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
