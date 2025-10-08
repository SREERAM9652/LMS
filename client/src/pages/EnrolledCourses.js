import React, { useEffect, useState } from "react";
import axios from "axios";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = process.env.REACT_APP_BACKEND_URI;

  useEffect(() => {
    const fetchCourses = async () => {
      const studentId = localStorage.getItem("userId");
      if (!studentId) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE}/api/enrolled-courses/${studentId}`);
        setCourses(data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to load enrolled courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [API_BASE]);

  const handleUnenroll = async (courseId) => {
    const studentId = localStorage.getItem("userId");
    if (!studentId) return alert("User ID is missing.");

    try {
      await axios.delete(`${API_BASE}/api/unenroll-course`, {
        data: { userId: studentId, courseId },
      });

      alert("Unenrolled successfully!");
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (err) {
      console.error("Error unenrolling:", err);
      alert("Failed to unenroll from the course.");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>⏳ Loading your enrolled courses...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "red" }}>{error}</p>;
  }

  return (
    <section style={{ marginLeft: "250px", width: "calc(100% - 250px)", padding: "30px", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#003c8f", marginBottom: "30px" }}>📜 Enrolled Courses</h2>

      {courses.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>😔 You are not enrolled in any courses yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {courses.map((course) => (
            <div
              key={course._id}
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 6px 12px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "450px",
              }}
            >
              <img src={course.img} alt={course.title} style={{ width: "100%", height: "180px", borderRadius: "10px", objectFit: "cover" }} />
              <h3 style={{ fontSize: "22px", color: "#003c8f", margin: "15px 0 10px" }}>{course.title}</h3>
              <p style={{ fontSize: "14px", color: "#555", textAlign: "center", marginBottom: "15px" }}>{course.desc}</p>
              <p style={{ fontSize: "16px", fontWeight: "bold" }}>Price: {course.price}</p>
              <button
                onClick={() => handleUnenroll(course._id)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Unenroll
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EnrolledCourses;
