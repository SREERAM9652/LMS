import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [questions, setQuestions] = useState([]);

  const API_BASE = process.env.REACT_APP_BACKEND_URI; // ✅ Backend URL from env

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/assessments/${assessmentId}`); // ✅ use env variable
        const { title, description, dueDate, questions } = response.data;

        setTitle(title || "");
        setDescription(description || "");
        setDueDate(dueDate ? new Date(dueDate).toISOString().split("T")[0] : "");
        setQuestions(
          questions?.length
            ? questions
            : [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
        );
      } catch (error) {
        console.error("Error fetching assessment:", error);
      }
    };
    fetchAssessment();
  }, [assessmentId, API_BASE]);

  const handleQuestionChange = (qIndex, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return updated;
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].options[optIndex] = value;
      return updated;
    });
  };

  const handleDeleteQuestion = (qIndex) => {
    setQuestions((prev) => prev.filter((_, index) => index !== qIndex));
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE}/api/assessments/${assessmentId}`, // ✅ use env variable
        { title, description, dueDate, questions },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } } // ✅ template string fix
      );

      alert("✅ Assessment Updated Successfully!");
      navigate("/assessments");
    } catch (error) {
      console.error("Error updating assessment", error);
      alert("❌ Failed to update assessment.");
    }
  };

  return (
    <section style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>✏️ Edit Assessment</h2>
        <form onSubmit={handleUpdate} style={styles.form}>
          <label style={styles.label}>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={styles.input} />

          <label style={styles.label}>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" style={styles.textarea} />

          <label style={styles.label}>Due Date:</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required style={styles.input} />

          {questions.map((q, qIndex) => (
            <div key={qIndex} style={styles.questionContainer}>
              <label style={styles.label}>Question {qIndex + 1}:</label>
              <input type="text" value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)} required style={styles.input} />
              {q.options.map((option, optIndex) => (
                <input key={optIndex} type="text" placeholder={`Option ${optIndex + 1}`} value={option} onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} required style={styles.input} />
              ))}
              <label style={styles.label}>Correct Answer:</label>
              <input type="text" value={q.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)} required style={styles.input} />
              <button type="button" onClick={() => handleDeleteQuestion(qIndex)} style={styles.deleteButton}>🗑️ Delete Question</button>
            </div>
          ))}

          <button type="button" onClick={handleAddQuestion} style={styles.addButton}>➕ Add Question</button>
          <button type="submit" style={styles.submitButton}>✅ Update Assessment</button>
          <button type="button" onClick={() => navigate("/assessments")} style={styles.cancelButton}>❌ Cancel</button>
        </form>
      </div>
    </section>
  );
};

const styles = {
  container: { marginLeft: "250px", width: "calc(100% - 250px)", padding: "30px", minHeight: "100vh", backgroundColor: "#f8f9fa", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "#ffffff", padding: "30px", borderRadius: "12px", boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)", width: "500px" },
  heading: { textAlign: "center", fontSize: "24px", fontWeight: "700", color: "#003c8f" },
  label: { fontSize: "16px", fontWeight: "bold", color: "#555" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "16px", width: "100%" },
  textarea: { padding: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "16px", resize: "none", width: "100%" },
  questionContainer: { background: "#f8f9fa", padding: "15px", borderRadius: "10px", marginBottom: "10px" },
  addButton: { padding: "10px", border: "none", borderRadius: "8px", background: "#28a745", color: "white", cursor: "pointer", marginTop: "10px" },
  deleteButton: { padding: "10px", background: "#dc3545", color: "white", borderRadius: "8px", cursor: "pointer", marginTop: "10px" },
  submitButton: { padding: "10px", border: "none", borderRadius: "8px", background: "#003c8f", color: "white", cursor: "pointer", marginTop: "10px", marginLeft: "10px" },
  cancelButton: { padding: "10px", border: "none", borderRadius: "8px", background: "#dc3545", color: "white", cursor: "pointer", marginTop: "10px", marginLeft: "10px" },
};

export default EditAssessment;
