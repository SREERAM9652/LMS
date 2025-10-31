import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Assessments from "./pages/Assessments";
import Messages from "./pages/Messages";
import DiscussionForum from "./pages/DiscussionForum";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import LoginSignup from "./components/LoginSignup"; 
import PersonalInfo from "./pages/PersonalInfo";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import EnrolledCourses from "./pages/EnrolledCourses";
import OngoingAssessments from "./pages/OngoingAssessments";
import CreateAssessment from "./pages/CreateAssessment";
import AttemptAssessment from "./pages/AttemptAssessment";
import EditAssessment from "./pages/EditAssessment";
import GeneralDiscussions from "./pages/GeneralDiscussions";
import Announcements from "./pages/Announcements";
import ForumPage from "./pages/ForumPage";
import CompletedAssessments from "./pages/CompletedAssessments";
import ProgressReport from "./pages/ProgressReport";
import AdminDashboard from "./pages/AdminDashboard";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedLoginStatus = localStorage.getItem("isLoggedIn");

    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
      setRole(storedRole || "user");
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && (
          <Sidebar 
            role={role} 
            onLogout={handleLogout} 
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
        )}
        
        <main className={`main-content ${isLoggedIn ? 'with-sidebar' : ''} ${sidebarOpen ? 'sidebar-open' : ''}`}>
          {isLoggedIn && (
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
              ☰
            </button>
          )}
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginSignup formType="login" setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<LoginSignup formType="signup" setIsLoggedIn={setIsLoggedIn} />} />
            
            {isLoggedIn ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/assessments/ongoing" element={<OngoingAssessments />} />
                <Route path="/attempt-assessment/:assessmentId" element={<AttemptAssessment />} />
                <Route path="/assessments/create" element={<CreateAssessment />} />
                <Route path="/assessments/edit/:assessmentId" element={<EditAssessment />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/forum" element={<DiscussionForum />} />
                <Route path="/forum/general" element={<GeneralDiscussions />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/personal-info" element={<PersonalInfo />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
                <Route path="/create-course" element={<CreateCourse role={role} />} />
                <Route path="/edit-course/:id" element={<EditCourse />} />
                <Route path="/enrolled-courses/:userId" element={<EnrolledCourses />} />
                <Route path="/forum/announcements" element={<Announcements />} />
                <Route path="/forum/courses" element={<ForumPage />} />
                <Route path="/assessments/completed" element={<CompletedAssessments />} />
                <Route path="/assessments/analytics" element={<ProgressReport />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
