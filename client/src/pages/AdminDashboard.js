import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const userId = localStorage.getItem("userId"); // Admin user ID
  const API_BASE = process.env.REACT_APP_BACKEND_URI; // ✅ Use environment variable

  useEffect(() => {
    fetchSummary();
    fetchUsers();
    fetchCourses();
    fetchAssessments();
    fetchSubmissions();
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

  return (
    <>
      <style>
        {`
          .dashboard-container { padding: 300px; padding-top:10px; margin-left: 1000px; max-width: 1200px; margin: auto; }
          .card-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-bottom: 40px; }
          .card { background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center; }
          .card h3 { font-size: 1.5rem; font-weight: bold; color: #007bff; }
          .card p { font-size: 1.2rem; margin-top: 10px; }
          .table-container { margin-top: 30px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; background-color: #fff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
          th, td { padding: 15px; text-align: left; border-top: 1px solid #ddd; }
          th { background-color: #f7f7f7; font-weight: bold; }
          tr:hover { background-color: #f1f1f1; }
          .table-container h2 { font-size: 1.75rem; font-weight: bold; color: #333; margin-bottom: 20px; }
          .table-container td, .table-container th { font-size: 1rem; color: #333; }
        `}
      </style>

      <div className="dashboard-container">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="card-container">
          <div className="card">
            <h3>Users</h3>
            <p>{summary.totalUsers ?? 0}</p>
          </div>
          <div className="card">
            <h3>Courses</h3>
            <p>{summary.totalCourses ?? 0}</p>
          </div>
          <div className="card">
            <h3>Assessments</h3>
            <p>{summary.totalAssessments ?? 0}</p>
          </div>
          <div className="card">
            <h3>Submissions</h3>
            <p>{summary.totalSubmissions ?? 0}</p>
          </div>
        </div>

        {/* Tables */}
        <div className="table-container">
          <Section title="Users" data={users} columns={["fullName", "email", "role"]} />
          <Section title="Courses" data={courses} columns={["title", "desc"]} />
          <Section title="Assessments" data={assessments} columns={["title", "courseId"]} />
          <Section title="Submissions" data={submissions} columns={["userId", "assessmentId", "score"]} />
        </div>
      </div>
    </>
  );
};

const Section = ({ title, data, columns }) => (
  <div className="table-container">
    <h2>{title}</h2>
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 text-left capitalize">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2">
                    {item[col]?.title || item[col]?.fullName || item[col] || "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-2 text-center">No data found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;
