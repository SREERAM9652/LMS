import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({ title: "", desc: "", price: "", img: "", video: "" });

    const API_BASE = process.env.REACT_APP_BACKEND_URI; // ✅ Use env variable

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/courses/${id}`);
                setCourse(response.data);
            } catch (err) {
                console.error("Error fetching course:", err);
            }
        };
        fetchCourse();
    }, [id, API_BASE]);

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE}/api/courses/${id}`, course, {
                headers: { "Content-Type": "application/json" },
            });
            alert("✅ Course updated successfully!");
            navigate("/courses");
        } catch (error) {
            console.error("Error updating course:", error);
            alert("❌ Failed to update course");
        }
    };

    return (
        <section 
            style={{
                marginLeft: "250px",
                width: "calc(100% - 250px)",
                padding: "30px",
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div 
                style={{
                    background: "#ffffff",
                    padding: "30px",
                    borderRadius: "12px",
                    width: "450px",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                }}
            >
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#003c8f", textAlign: "center" }}>
                    ✏️ Edit Course
                </h2>
                <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <label style={styles.label}>Title:</label>
                    <input type="text" name="title" value={course.title} onChange={handleChange} required style={styles.input} />

                    <label style={styles.label}>Description:</label>
                    <textarea name="desc" value={course.desc} onChange={handleChange} required rows="3" style={styles.textarea} />

                    <label style={styles.label}>Price:</label>
                    <input type="number" name="price" value={course.price} onChange={handleChange} required style={styles.input} />

                    <label style={styles.label}>Image URL:</label>
                    <input type="text" name="img" value={course.img} onChange={handleChange} required style={styles.input} />

                    <button type="submit" style={styles.submitButton}>✅ Update Course</button>
                </form>
            </div>
        </section>
    );
};

const styles = {
    label: { fontSize: "16px", fontWeight: "bold", color: "#555" },
    input: { padding: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "16px" },
    textarea: { padding: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "16px", resize: "none" },
    submitButton: { backgroundColor: "#007bff", color: "white", padding: "12px", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer", transition: "all 0.3s ease", marginTop: "10px" },
};

export default EditCourse;
