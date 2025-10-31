import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const Sidebar = ({ role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Highlight active route
  const isActive = (path) => (location.pathname === path ? "active" : "");

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/courses", label: "Courses", icon: "📚" },
    { path: "/assessments", label: "Assessments", icon: "📝" },
    { path: "/forum", label: "Discussion Forum", icon: "💻" },
  ];

  const adminItems = [
    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/create-course", label: "Add Course", icon: "➕" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🎓 LMS</h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map(({ path, label, icon }) => (
          <button
            key={path}
            className={`menu-item ${isActive(path)}`}
            onClick={() => navigate(path)}
          >
            <span className="icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}

        {role?.toLowerCase() === "admin" && (
          <>
            <hr className="divider" />
            <p className="section-title">Admin</p>
            {adminItems.map(({ path, label, icon }) => (
              <button
                key={path}
                className={`menu-item ${isActive(path)}`}
                onClick={() => navigate(path)}
              >
                <span className="icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </>
        )}

        <hr className="divider" />
        <button className="menu-item logout" onClick={onLogout}>
          🚪 <span>Logout</span>
        </button>
      </nav>

      <style jsx="true">{`
        .sidebar {
          width: 250px;
          background: linear-gradient(180deg, #ffffff, #f8fafc);
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .sidebar-header {
          text-align: center;
          font-weight: 700;
          color: #0f172a;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0 1rem;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          background: none;
          border: none;
          font-size: 1rem;
          color: #334155;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .menu-item:hover {
          background: #e2e8f0;
        }

        .menu-item.active {
          background: #1d4ed8;
          color: #ffffff;
          font-weight: 600;
        }

        .icon {
          font-size: 1.25rem;
        }

        .divider {
          margin: 1rem 0;
          border: none;
          border-top: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0 1rem 0.5rem;
          font-weight: 600;
        }

        .logout {
          color: #dc2626;
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
            font-size: 0.9rem;
          }

          .menu-item {
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
