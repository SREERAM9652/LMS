import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar"; // Adjust the import path as needed

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const API_BASE = process.env.REACT_APP_BACKEND_URI;
  const userRole = localStorage.getItem("role") || "admin"; // Get role from localStorage

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSummary(),
          fetchUsers(),
          fetchCourses(),
          fetchAssessments(),
          fetchSubmissions()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3>{value ?? 0}</h3>
        <p>{title}</p>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );

  const TabButton = ({ name, isActive, onClick, icon }) => (
    <button 
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={() => onClick(name)}
    >
      <span className="tab-icon">{icon}</span>
      {name}
    </button>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar role={userRole} onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <div className="header-actions">
              <button className="btn-primary">
                <span className="btn-icon">+</span>
                New Item
              </button>
              <div className="user-profile">
                <div className="avatar">
                  {localStorage.getItem("userName")?.charAt(0) || "A"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="dashboard-tabs">
          <TabButton 
            name="Overview" 
            isActive={activeTab === "overview"} 
            onClick={setActiveTab}
            icon="📊"
          />
          <TabButton 
            name="Users" 
            isActive={activeTab === "users"} 
            onClick={setActiveTab}
            icon="👥"
          />
          <TabButton 
            name="Courses" 
            isActive={activeTab === "courses"} 
            onClick={setActiveTab}
            icon="📚"
          />
          <TabButton 
            name="Assessments" 
            isActive={activeTab === "assessments"} 
            onClick={setActiveTab}
            icon="📝"
          />
          <TabButton 
            name="Submissions" 
            isActive={activeTab === "submissions"} 
            onClick={setActiveTab}
            icon="📨"
          />
        </nav>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {/* Summary Cards */}
          <section className="stats-section">
            <div className="stats-grid">
              <StatCard 
                title="Total Users" 
                value={summary.totalUsers} 
                icon="👥"
                color="#4f46e5"
                subtitle="Registered users"
              />
              <StatCard 
                title="Total Courses" 
                value={summary.totalCourses} 
                icon="📚"
                color="#10b981"
                subtitle="Available courses"
              />
              <StatCard 
                title="Total Assessments" 
                value={summary.totalAssessments} 
                icon="📝"
                color="#f59e0b"
                subtitle="Active assessments"
              />
              <StatCard 
                title="Total Submissions" 
                value={summary.totalSubmissions} 
                icon="📨"
                color="#ef4444"
                subtitle="Submitted work"
              />
            </div>
          </section>

          {/* Data Tables */}
          <section className="tables-section">
            {activeTab === "overview" && (
              <div className="tables-grid">
                <DataTable 
                  title="Recent Users" 
                  data={users.slice(0, 5)} 
                  columns={["fullName", "email", "role"]}
                  viewAll={() => setActiveTab("users")}
                />
                <DataTable 
                  title="Recent Courses" 
                  data={courses.slice(0, 5)} 
                  columns={["title", "desc"]}
                  viewAll={() => setActiveTab("courses")}
                />
              </div>
            )}
            
            {activeTab === "users" && (
              <DataTable 
                title="All Users" 
                data={users} 
                columns={["fullName", "email", "role", "status"]}
                searchable
              />
            )}
            
            {activeTab === "courses" && (
              <DataTable 
                title="All Courses" 
                data={courses} 
                columns={["title", "desc", "instructor", "enrolled"]}
                searchable
              />
            )}
            
            {activeTab === "assessments" && (
              <DataTable 
                title="All Assessments" 
                data={assessments} 
                columns={["title", "courseId", "dueDate", "status"]}
                searchable
              />
            )}
            
            {activeTab === "submissions" && (
              <DataTable 
                title="All Submissions" 
                data={submissions} 
                columns={["userId", "assessmentId", "score", "submittedAt", "status"]}
                searchable
              />
            )}
          </section>
        </main>
      </div>

      <style jsx>{`
        .app-container {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .main-content {
          flex: 1;
          margin-left: 250px; /* Adjust based on your sidebar width */
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Header Styles */
        .dashboard-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.2s;
        }

        .btn-primary:hover {
          background: #4338ca;
        }

        .user-profile .avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: #4f46e5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        /* Tab Navigation */
        .dashboard-tabs {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 2rem;
        }

        .tab-button {
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .tab-button:hover {
          color: #4f46e5;
        }

        .tab-button.active {
          color: #4f46e5;
          border-bottom-color: #4f46e5;
        }

        .tab-icon {
          font-size: 1rem;
        }

        /* Main Content Area */
        .dashboard-main {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* Stats Section */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: white;
        }

        .stat-content h3 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .stat-content p {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .stat-subtitle {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        /* Tables Section */
        .tables-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .data-table {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-header h2 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .table-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-secondary {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
        }

        .search-box {
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          width: 200px;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f8fafc;
        }

        th {
          padding: 0.75rem 1.5rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
        }

        td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.875rem;
          color: #1e293b;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .no-data {
          padding: 2rem;
          text-align: center;
          color: #64748b;
        }

        /* Loading State */
        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid #e2e8f0;
          border-top: 2px solid #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .tables-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .main-content {
            margin-left: 0;
          }
        }

        @media (max-width: 768px) {
          .dashboard-main {
            padding: 1rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .dashboard-tabs {
            overflow-x: auto;
            white-space: nowrap;
            padding: 0 1rem;
          }
          
          .dashboard-header {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

const DataTable = ({ title, data, columns, searchable, viewAll }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(item =>
        columns.some(col => 
          String(item[col] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data, columns]);

  return (
    <div className="data-table">
      <div className="table-header">
        <h2>{title}</h2>
        <div className="table-actions">
          {searchable && (
            <input
              type="text"
              placeholder="Search..."
              className="search-box"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          {viewAll && (
            <button className="btn-secondary" onClick={viewAll}>
              View All
            </button>
          )}
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="capitalize">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData?.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col}>
                      {item[col]?.title || item[col]?.fullName || item[col] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
