import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate(); // React Router navigation

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Learning Management System</h1>
      <p className="homepage-description">
        A powerful platform to enhance your learning experience. Join now to access courses, assessments, discussions, and more!
      </p>
      <div className="homepage-buttons">
        <button className="login-button" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="signup-button" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default HomePage;
