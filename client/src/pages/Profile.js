import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Make sure this file includes the CSS below

const Profile = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // Assume 'role' is stored in localStorage

  const profileData = [
    {
      title: "👤 Personal Info",
      desc: "View and edit your personal details.",
      path: "/profile/personal-info",
    },
    {
      title: "📚 Enrolled Courses",
      desc: "Check the list of your active courses.",
      path: "/enrolled-courses/:userId",
    },
    {
      title: "📊 Progress Report",
      desc: "Monitor your learning progress and achievements.",
      path: "/assessments/analytics",
    },
  ];

  const filteredProfileData =
    userRole === "admin" ? [profileData[0]] : profileData;

  return (
    <>
      <style>
        {`
        .profile-container {
          padding: 20px;
          margin-left: 250px;
          max-width: 1200px;
          margin: auto;
        }

        .profile-container h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 40px;
          color: #333;
        }

        .profile-card {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.2s ease-in-out;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .profile-card:hover {
          transform: translateY(-5px);
        }

        .profile-card .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #007bff;
        }

        .profile-card .card-text {
          font-size: 1rem;
          color: #555;
          margin: 10px 0;
          flex-grow: 1;
        }

        .profile-card .btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 15px;
          font-size: 1rem;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }

        .profile-card .btn:hover {
          background-color: #0056b3;
        }
      `}
      </style>

      <section className="profile-container mt-5">
        <h1 className="text-center">Profile</h1>
        <div className="row">
          {filteredProfileData.map((data, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <div className="profile-card">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{data.title}</h5>
                  <p className="card-text">{data.desc}</p>
                  <button
                    className="btn mt-auto"
                    onClick={() => navigate(data.path)}
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Profile;
