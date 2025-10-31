import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const userId = localStorage.getItem("userId");
  const API_BASE = process.env.REACT_APP_BACKEND_URI;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, usersRes, coursesRes, assessRes, subsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/summary?userId=${userId}`),
        axios.get(`${API_BASE}/api/admin/users?userId=${userId}`),
        axios.get(`${API_BASE}/api/admin/courses?userId=${userId}`),
        axios.get(`${API_BASE}/api/admin/assessments?userId=${userId}`),
        axios.get(`${API_BASE}/api/admin/submissions?userId=${userId}`),
      ]);

      setSummary(summaryRes.data);
      setUsers(usersRes.data);
      setCourses(coursesRes.data);
      setAssessments(assessRes.data);
      setSubmissions(subsRes.data);
    } catch (err) {
      console.error("Error loading dashboard data", err);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Overview of platform statistics & activity</p>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard title="Users" count={summary.totalUsers} color="#007bff" />
        <SummaryCard title="Courses" count={summary.totalCourses} color="#28a745" />
        <SummaryCard title="Assessments" count={summary.totalAssessments} color="#ffc107" />
        <SummaryCard title="Submissions" count={summary.totalSubmissions} color="#17a2b8" />
      </div>

      {/* Data Tables */}
      <div className="section-container">
        <Section title="Users" data={users} columns={["fullName", "email", "role"]} />
        <Section title="Courses" data={courses} columns={["title", "desc"]} />
        <Section title="Assessments" data={assessments} columns={["title", "courseId"]} />
        <Section title="Submissions" data={submissions} columns={["userId", "assessmentId", "score"]} />
      </div>

      {/* Styles */}
      <style jsx="true">{`
        .dashboard {
          padding: 2rem;
          background-color: #f8fafc;
          min-height: 100vh;
          color: #333;
          font-family: 'Inter', sans-serif;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
        }

        .subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin-top: 0.25rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .summary-card {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }

        .summary-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .summary-card p {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        .section-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section h2 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        th, td {
          padding: 0.9rem 1rem;
          text-align: left;
          border-top: 1px solid #f1f5f9;
        }

        th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        tr:hover {
          background-color: #f9fafb;
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 1rem;
          }
          .summary-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

const SummaryCard = ({ title, count = 0, color }) => (
  <div className="summary-card" style={{ borderTop: `4px solid ${color}` }}>
    <h3>{title}</h3>
    <p style={{ color }}>{count}</p>
  </div>
);

const Section = ({ title, data, columns }) => (
  <div className="section">
    <h2>{title}</h2>
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="capitalize">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col}>{item[col]?.title || item[col]?.fullName || item[col] || "-"}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "1rem" }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;
