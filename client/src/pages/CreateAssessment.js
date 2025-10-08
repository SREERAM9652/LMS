import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CreateAssessment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [dueDate, setDueDate] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAssessments(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchAssessments = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/assessments/course/${courseId}`);
      setAssessments(response.data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setAssessments([]); // Reset if no assessments are found
    }
  };
  // ✅ Function to handle changes in question fields
  const handleQuestionChange = (qIndex, field, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
      return updatedQuestions;
    });
  };

  // ✅ Function to handle changes in answer options
  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[qIndex].options[optIndex] = value;
      return updatedQuestions;
    });
  };

  const handleEditAssessment = (assessmentId) => {
    navigate(`/assessments/edit/${assessmentId}`);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!assessmentId) {
      alert("❌ Invalid assessment ID.");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this assessment?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/assessments/${assessmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      alert(response.data.message);
      fetchAssessments(selectedCourse); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting assessment:", error.response?.data || error.message);
      alert("❌ Failed to delete assessment.");
    }
  };
  
  const handleDeleteQuestion = (qIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(qIndex, 1);
    setQuestions(updatedQuestions);
  };
  

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId || !selectedCourse) {
      alert("Please select a course and ensure you are logged in as an admin.");
      return;
    }

    const requestData = {
      userId,
      title,
      description,
      courseId: selectedCourse,
      dueDate,
      questions,
    };

    try {
      await axios.post("http://localhost:5000/api/assessments/create", requestData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("✅ Assessment Created Successfully!");
      setShowForm(false);
      fetchAssessments(selectedCourse);
    } catch (error) {
      console.error("Error creating assessment", error);
      alert("❌ Failed to create assessment.");
    }
  };

  return (
    <section style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📝 Manage Assessments</h2>

        <label style={styles.label}>Select Course:</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required style={styles.select}>
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        {assessments.length > 0 ? (
          <div style={{ marginTop: "20px" }}>
            <h3 style={styles.subHeading}>📌 Existing Assessments:</h3>
            <ul style={styles.assessmentList}>
              {assessments.map((assessment) => (
                <li key={assessment._id} style={styles.assessmentItem}>
                  <strong>{assessment.title}</strong> - {assessment.description} (Due: {assessment.dueDate})
                  <button onClick={() => handleEditAssessment(assessment._id)} style={styles.editButton}>✏️ Edit</button>
                  <button onClick={() => handleDeleteAssessment(assessment._id)} style={styles.deleteButton}>🗑️ Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          selectedCourse && <p style={styles.noDataText}>No assessments found for this course.</p>
        )}

        <button onClick={() => setShowForm(true)} style={styles.addButton}>
          ➕ Add New Assessment
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={styles.input} />

            <label style={styles.label}>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" style={styles.textarea} />

            <label style={styles.label}>Due Date:</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required style={styles.input} />

            
{questions.map((q, qIndex) => (
  <div key={qIndex} style={styles.questionContainer}>
    <label style={styles.label}>Question {qIndex + 1}:</label>
    <input
      type="text"
      value={q.questionText}
      onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
      required
      style={styles.input}
    />
    {q.options.map((option, optIndex) => (
      <input
        key={optIndex}
        type="text"
        placeholder={`Option ${optIndex + 1}`}
        value={option}
        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
        required
        style={styles.input}
      />
    ))}
    <label style={styles.label}>Correct Answer:</label>
    <input
      type="text"
      value={q.correctAnswer}
      onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
      required
      style={styles.input}
    />

    {/* 🗑️ Delete Question Button */}
    <button
      type="button"
      onClick={() => handleDeleteQuestion(qIndex)}
      style={styles.deleteButton}
    >
      🗑️ Delete Question
    </button>
  </div>
))}

            <button type="button" onClick={handleAddQuestion} style={styles.addQuestionButton}>
              ➕ Add Question
            </button>
            <button type="submit" style={styles.submitButton}>
              ✅ Create Assessment
            </button>
          </form>
        )}
      </div>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
    width: "500px",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "700",
    color: "#003c8f",
  },
  subHeading: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#003c8f",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#555",
  },
  select: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    background: "white",
    width: "100%",
  },
  assessmentList: {
    listStyle: "none",
    padding: "0",
  },
  assessmentItem: {
    padding: "10px",
    background: "#f8f9fa",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  noDataText: {
    color: "red",
    marginTop: "10px",
  },
  addButton: {
    marginTop: "15px",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#003c8f",
    color: "white",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    width: "100%",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    resize: "none",
    width: "100%",
  },
  questionContainer: {
    background: "#f8f9fa",
    padding: "15px",
    borderRadius: "10px",
  },
  addQuestionButton: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#28a745",
    color: "white",
    cursor: "pointer",
  },
  submitButton: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#003c8f",
    color: "white",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px",
    border: "none",
    borderRadius: "8px",
    background: "#dc3545", // Red color for delete
    color: "white",
    cursor: "pointer",
    marginTop: "10px",
   
    marginLeft: "10px",
  },
  editButton: {
    padding: "8px",
    border: "none",
    borderRadius: "8px",
    background: "#ffc107", 
    color: "white",
    cursor: "pointer",
    marginTop: "10px",
    marginLeft: "10px",
  },
  
};

export default CreateAssessment;
