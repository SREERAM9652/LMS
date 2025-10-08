import React, { useEffect, useState } from "react";
import axios from "axios";

const CompletedAssessments = () => {
  const [completed, setCompleted] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCompleted = async () => {
      const res = await axios.get(`http://localhost:5000/api/assessments/completed/${userId}`);
      setCompleted(res.data);
    };
    fetchCompleted();
  }, [userId]);

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
