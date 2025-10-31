import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const API_BASE = process.env.REACT_APP_BACKEND_URI;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchSummary(),
          fetchUsers(),
          fetchCourses(),
          fetchAssessments(),
          fetchSubmissions()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchSummary = async () => {
    const res = await axios.get(`${API_BASE}/api/admin/summary?userId=${userId}`);
    setSummary(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE}/api/admin/users?userId=${userId}`);
    setUsers(res.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get(`${API_BASE}/api/admin/courses?userId=${userId}`);
    setCourses(res.data);
  };

  const fetchAssessments = async () => {
    const res = await axios.get(`${API_BASE}/api/admin/assessments?userId=${userId}`);
    setAssessments(res.data);
  };

  const fetchSubmissions = async () => {
    const res = await axios.get(`${API_BASE}/api/admin/submissions?userId=${userId}`);
    setSubmissions(res.data);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Comprehensive overview of your learning management system</p>
      </div>

      {/* Summary Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon users">👥</div>
          <div className="metric-content">
            <h3>Total Users</h3>
            <span className="metric-value">{summary.totalUsers ?? 0}</span>
            <span className="metric-trend">Active users</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon courses">📚</div>
          <div className="metric-content">
            <h3>Courses</h3>
            <span className="metric-value">{summary.totalCourses ?? 0}</span>
            <span className="metric-trend">Available courses</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon assessments">📝</div>
          <div className="metric-content">
            <h3>Assessments</h3>
            <span className="metric-value">{summary.totalAssessments ?? 0}</span>
            <span className="metric-trend">Active assessments</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon submissions">📊</div>
          <div className="metric-content">
            <h3>Submissions</h3>
            <span className="metric-value">{summary.totalSubmissions ?? 0}</span>
            <span className="metric-trend">Total submissions</span>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="data-section">
        <Section title="Users" data={users} columns={["fullName", "email", "role"]} />
        <Section title="Courses" data={courses} columns={["title", "desc"]} />
        <Section title="Assessments" data={assessments} columns={["title", "courseId"]} />
        <Section title="Submissions" data={submissions} columns={["userId", "assessmentId", "score"]} />
      </div>
    </div>
  );
};

const Section = ({ title, data, columns }) => (
  <div className="data-table-container">
    <div className="table-header">
      <h2>{title}</h2>
      <span className="record-count">{data?.length || 0} records</span>
    </div>
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="table-head">
                {col.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((item, idx) => (
              <tr key={idx} className="table-row">
                {columns.map((col) => (
                  <td key={col} className="table-cell">
                    {item[col]?.title || item[col]?.fullName || item[col] || "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="no-data-row">
              <td colSpan={columns.length} className="no-data-cell">
                <div className="no-data-content">
                  <span>📭</span>
                  <p>No data available</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;

<style jsx>{`
  .admin-dashboard {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    background: #f8fafc;
    min-height: 100vh;
  }

  .dashboard-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    color: #64748b;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .dashboard-header {
    margin-bottom: 2rem;
  }

  .dashboard-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  .dashboard-header p {
    color: #64748b;
    font-size: 1.1rem;
    margin: 0;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .metric-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .metric-icon {
    font-size: 2rem;
    margin-right: 1rem;
    padding: 0.75rem;
    border-radius: 10px;
    background: #f1f5f9;
  }

  .metric-icon.users { background: #dbeafe; color: #1d4ed8; }
  .metric-icon.courses { background: #f0fdf4; color: #16a34a; }
  .metric-icon.assessments { background: #fef3c7; color: #d97706; }
  .metric-icon.submissions { background: #f3e8ff; color: #9333ea; }

  .metric-content h3 {
    font-size: 0.9rem;
    font-weight: 600;
    color: #64748b;
    margin: 0 0 0.25rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    display: block;
    line-height: 1;
  }

  .metric-trend {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .data-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .data-table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .table-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .record-count {
    font-size: 0.875rem;
    color: #64748b;
    background: #e2e8f0;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .table-head {
    background: #f8fafc;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .table-row {
    transition: background-color 0.2s ease;
  }

  .table-row:hover {
    background-color: #f8fafc;
  }

  .table-cell {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    color: #374151;
    font-size: 0.9rem;
  }

  .no-data-row {
    border-bottom: none;
  }

  .no-data-cell {
    padding: 3rem;
    text-align: center;
  }

  .no-data-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #64748b;
  }

  .no-data-content span {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .no-data-content p {
    margin: 0;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .admin-dashboard {
      padding: 1rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
    }

    .metrics-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .metric-card {
      padding: 1rem;
    }

    .table-header {
      padding: 1rem;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .table-cell {
      padding: 0.75rem;
    }
  }
`}</style>
