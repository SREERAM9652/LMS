import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";  

const Sidebar = ({ role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a link is active
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="col-md-3 col-lg-2 d-md-block sidebar">
      <div className="position-sticky">
        <h2 className="text-center py-3">🎓 LMS</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button className={`nav-link ${isActive("/dashboard")}`} onClick={() => navigate("/dashboard")}>📊 Dashboard</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${isActive("/courses")}`} onClick={() => navigate("/courses")}>📚 Courses</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${isActive("/assessments")}`} onClick={() => navigate("/assessments")}>📝 Assessments</button>
          </li>
          
          <li className="nav-item">
            <button className={`nav-link ${isActive("/forum")}`} onClick={() => navigate("/forum")}>💻 Discussion Forum</button>
          </li>
          

          {/* Admin-only options */}
          {role?.toLowerCase() === "admin" && (
            <>
              <li className="nav-item">
                <button className={`nav-link ${isActive("/analytics")}`} onClick={() => navigate("/analytics")}>📈 Analytics</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${isActive("/create-course")}`} onClick={() => navigate("/create-course")}>➕ Add Course</button>
              </li>
            </>
          )}

          <li className="nav-item">
            <button className={`nav-link ${isActive("/profile")}`} onClick={() => navigate("/profile")}>👤 Profile</button>
          </li>
          

          {/* Logout Button */}
          <li className="nav-item">
            <button className="nav-link text-danger" onClick={onLogout}>🚪 Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
