import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OngoingAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = localStorage.getItem("token");

        const assessmentsRes = await axios.get(`https://lms-2inz.onrender.com/api/assessments/ongoing/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssessments(assessmentsRes.data);
        setFilteredAssessments(assessmentsRes.data);

        const coursesRes = await axios.get(`https://lms-2inz.onrender.com/api/enrolled-courses/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, [userId]);

  useEffect(() => {
    if (selectedCourse === "all") {
      setFilteredAssessments(assessments);
    } else {
      setFilteredAssessments(assessments.filter(a => a.courseId === selectedCourse));
    }
  }, [selectedCourse, assessments]);

  return (
    <section style={styles.container}>
      <div style={styles.header}>
        <h2>📝 Your Ongoing Assessments</h2>
        <div style={styles.filterContainer}>
          <label>Filter by Course:</label>
          <select style={styles.select} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p style={styles.loading}>🔄 Loading ongoing assessments...</p>
      ) : (
        <>
          {filteredAssessments.length === 0 ? (
            <p style={styles.noData}>😔 No active assessments available.</p>
          ) : (
            <div style={styles.gridContainer}>
              {filteredAssessments.map(assessment => (
                <div key={assessment._id} style={styles.card}>
                  <h3>{assessment.title}</h3>
                  <p>{assessment.description}</p>
                  <button style={styles.primaryBtn} onClick={() => navigate(`/attempt-assessment/${assessment._id}`)}>
                    Attempt Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <button style={styles.secondaryBtn} onClick={() => navigate("/assessments")}>
        🔙 Back
      </button>
    </section>
  );
};

const styles = {
  container: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    padding: "30px",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  select: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
  },
  secondaryBtn: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    marginTop: "20px",
  },
  noData: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "10px",
  },
  loading: {
    textAlign: "center",
    fontSize: "20px",
    color: "#333",
    marginTop: "50px",
  },
};

export default OngoingAssessments;
