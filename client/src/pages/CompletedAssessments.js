import React, { useEffect, useState } from "react";
import axios from "axios";

const CompletedAssessments = () => {
  const [completed, setCompleted] = useState([]);
  const userId = localStorage.getItem("userId");
  const API_BASE = process.env.REACT_APP_BACKEND_URI; // ✅ Use env variable

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/assessments/completed/${userId}`);
        setCompleted(res.data);
      } catch (error) {
        console.error("Error fetching completed assessments:", error.response?.data || error.message);
      }
    };
    if (userId) fetchCompleted();
  }, [userId, API_BASE]);

  return (
    <div style={styles.container}>
      <h2>✅ Completed Assessments</h2>
      {completed.length === 0 ? (
        <p>No completed assessments yet.</p>
      ) : (
        <div style={styles.grid}>
          {completed.map((sub) => (
            <div key={sub._id} style={styles.card}>
              <h4>{sub.assessmentId.title}</h4>
              <p><strong>Score:</strong> {sub.score}</p>
              <p><strong>Attempted on:</strong> {new Date(sub.attemptedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "30px", marginLeft: "250px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default CompletedAssessments;
