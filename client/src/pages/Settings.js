import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../App.css";

const Settings = () => {
  const navigate = useNavigate(); // React Router navigation

  const settingsData = [
    { title: "⚙️ Account Settings", desc: "Update your account details and preferences.", path: "/settings/account" },
    { title: "🔒 Privacy & Security", desc: "Manage your password and security options.", path: "/settings/privacy" },
    { title: "📧 Notification Settings", desc: "Customize your email and push notifications.", path: "/settings/notifications" },
    { title: "🎨 Theme Preferences", desc: "Switch between light and dark mode.", path: "/settings/theme" },
  ];

  return (
    <section className="container mt-5">
      <h1 className="text-center">Settings</h1>
      <div className="row">
        {settingsData.map((data, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{data.title}</h5>
                <p className="card-text flex-grow-1">{data.desc}</p>
                <button className="btn btn-primary mt-auto" onClick={() => navigate(data.path)}>
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Settings;
