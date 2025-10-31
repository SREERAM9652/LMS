import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ role, onLogout, isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  const menuItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/courses", icon: "📚", label: "Courses" },
    { path: "/assessments", icon: "📝", label: "Assessments" },
    { path: "/forum", icon: "💻", label: "Discussion Forum" },
  ];

  const adminItems = [
    { path: "/admin/dashboard", icon: "👨‍💼", label: "Admin Dashboard" },
    { path: "/analytics", icon: "📈", label: "Analytics" },
    { path: "/create-course", icon: "➕", label: "Add Course" },
  ];

  const userItems = [
    { path: "/profile", icon: "👤", label: "Profile" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
    { path: "/support", icon: "🛟", label: "Support" },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">LMS Pro</span>
          </div>
          <button className="sidebar-close" onClick={onToggle}>×</button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">Main Menu</div>
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`nav-link ${isActive(item.path)}`}
                onClick={() => {
                  navigate(item.path);
                  onToggle();
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </button>
            ))}
          </div>

          {role?.toLowerCase() === "admin" && (
            <div className="nav-section">
              <div className="nav-label">Administration</div>
              {adminItems.map((item) => (
                <button
                  key={item.path}
                  className={`nav-link ${isActive(item.path)}`}
                  onClick={() => {
                    navigate(item.path);
                    onToggle();
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="nav-section">
            <div className="nav-label">Account</div>
            {userItems.map((item) => (
              <button
                key={item.path}
                className={`nav-link ${isActive(item.path)}`}
                onClick={() => {
                  navigate(item.path);
                  onToggle();
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
