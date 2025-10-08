import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AttemptAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const API_BASE = process.env.REACT_APP_BACKEND_URI; // ✅ Use env variable
  const token = localStorage.getItem("token");

  const [assessment, setAssessment] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/assessments/${assessmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssessment(res.data);
      } catch (err) {
        setError("Error fetching assessment");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [assessmentId, API_BASE, token]);

  const handleSelectAnswer = (questionId, option) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: option });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answers = Object.keys(selectedAnswers).map((questionId) => ({
        questionId,
        selectedAnswer: selectedAnswers[questionId],
      }));

      const res = await axios.post(
        `${API_BASE}/api/submissions/submit`,
        {
          userId,
          assessmentId,
          courseId: assessment.courseId,
          answers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Assessment submitted! Your score: ${res.data.newSubmission.score}`);
      navigate("/assessments");
    } catch (err) {
      alert("Error submitting assessment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={styles.loading}>⏳ Loading assessment...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <section style={styles.container}>
      <h2>{assessment.title}</h2>
      <p>{assessment.description}</p>

      {assessment.questions.map((q) => (
        <div key={q._id} style={styles.questionCard}>
          <h4>{q.questionText}</h4>
          {q.options.map((option, index) => (
            <div key={index} style={styles.option}>
              <input
                type="radio"
                name={q._id}
                value={option}
                checked={selectedAnswers[q._id] === option}
                onChange={() => handleSelectAnswer(q._id, option)}
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      ))}

      <button
        style={styles.primaryBtn}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Assessment"}
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
  questionCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
    marginBottom: "15px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "5px",
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
    marginTop: "20px",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "red",
  },
};

export default AttemptAssessment;
