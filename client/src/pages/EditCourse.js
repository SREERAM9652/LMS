import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({ title: "", desc: "", price: "", img: "", video: "" });

    useEffect(() => {
        fetch(`http://localhost:5000/api/courses/${id}`)
            .then((res) => res.json())
            .then((data) => setCourse(data))
            .catch((err) => console.error("Error fetching course:", err));
    }, [id]);

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(course),
            });

            if (response.ok) {
                alert("✅ Course updated successfully!");
                navigate("/courses");
            } else {
                alert("❌ Failed to update course");
            }
        } catch (error) {
            console.error("Error updating course:", error);
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
                    <label style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>Title:</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={course.title} 
                        onChange={handleChange} 
                        required 
                        style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "16px",
                        }}
                    />

                    <label style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>Description:</label>
                    <textarea 
                        name="desc" 
                        value={course.desc} 
                        onChange={handleChange} 
                        required 
                        rows="3"
                        style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "16px",
                            resize: "none",
                        }}
                    />

                    <label style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>Price:</label>
                    <input 
                        type="number" 
                        name="price" 
                        value={course.price} 
                        onChange={handleChange} 
                        required 
                        style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "16px",
                        }}
                    />

                    <label style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>Image URL:</label>
                    <input 
                        type="text" 
                        name="img" 
                        value={course.img} 
                        onChange={handleChange} 
                        required 
                        style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "16px",
                        }}
                    />

                    

                    <button 
                        type="submit" 
                        style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            padding: "12px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            marginTop: "10px",
                        }}
                    >
                        ✅ Update Course
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditCourse;
