import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import OngoingAssessments from "./OngoingAssessments";

const Assessments = () => {
  const navigate = useNavigate();
  const [viewOngoing, setViewOngoing] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  if (role === null) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const studentItems = [
    { title: "📝 Ongoing Assessments", desc: "View and complete active assessments.", path: "/assessments/ongoing" },
    { title: "✅ Completed Assessments", desc: "Review your past submissions and scores.", path: "/assessments/completed" },
    { title: "📊 Performance Analytics", desc: "Analyze your strengths and areas for improvement.", path: "/assessments/analytics" },
  ];

  const adminItems = [
    { title: "📌 Create New Assessment", desc: "Design and assign assessments to students.", path: "/assessments/create" }
  ];

  return (
    <>
      <style>
        {`
          .main-content {
            margin-left: 250px;
            padding: 20px;
          }

          .container {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
          }

          .card {
            width: 100%;
            max-width: 500px;
            border-radius: 12px;
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            background-color: #ffffff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            margin: auto;
            text-align: center;
            overflow: hidden;
          }

          .card:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          }

          .card-body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px;
          }

          .btn-primary {
            background-color: #007bff;
            border: none;
            border-radius: 6px;
            padding: 10px 15px;
            font-size: 1rem;
            transition: background-color 0.3s;
          }

          .btn-primary:hover {
            background-color: #0056b3;
          }

          .admin-container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
          }

          .admin-card {
            width: 500px !important;
            max-width: 100%;
          }

          @media screen and (max-width: 768px) {
            .main-content {
              margin-left: 0;
              padding: 15px;
            }
            .card {
              max-width: 100%;
            }
          }
        `}
      </style>

      {role === "admin" ? (
        <section className="container main-content mt-5 admin-container">
          <h1 className="text-center">Assessments</h1>
          <div className="row justify-content-center">
            {adminItems.map((item, index) => (
              <div key={index} className="mb-4 d-flex justify-content-center">
                <div className="card h-100 shadow-sm admin-card">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text flex-grow-1">{item.desc}</p>
                    <button className="btn btn-primary mt-auto" onClick={() => navigate(item.path)}>
                      Create Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : viewOngoing ? (
        <OngoingAssessments />
      ) : (
        <section className="container main-content mt-5">
          <h1 className="text-center">Assessments</h1>
          <div className="row">
            {studentItems.map((item, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text flex-grow-1">{item.desc}</p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => item.path === "ongoing" ? setViewOngoing(true) : navigate(item.path)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Assessments;
