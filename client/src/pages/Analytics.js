import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";  // ✅ Use "../" to go up one level

const Analytics = ({ role }) => {
    const navigate = useNavigate(); // React Router navigation

    const analyticsData = [
      { title: "📊 Course Performance", desc: "Track student engagement and course progress.", path: "/analytics/course-performance" },
      { title: "📝 Assignment Statistics", desc: "Analyze assignment completion and grades.", path: "/analytics/assignment-stats" },
      { title: "📅 Attendance Reports", desc: "Monitor student attendance trends.", path: "/analytics/attendance" },
    ];

    if (role === "admin") {
      analyticsData.push(
        { title: "👥 User Activity", desc: "View active users and engagement metrics.", path: "/analytics/user-activity" },
        { title: "💰 Revenue Insights", desc: "Analyze course sales and revenue generation.", path: "/analytics/revenue" }
      );
    }

    return (
      <section className="container mt-5">
        <h1 className="text-center">Analytics Dashboard</h1>
        <div className="row">
          {analyticsData.map((data, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{data.title}</h5>
                  <p className="card-text flex-grow-1">{data.desc}</p>
                  <button className="btn btn-primary mt-auto" onClick={() => navigate(data.path)}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
};

export default Analytics;
