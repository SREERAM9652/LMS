import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState(null);
    const [checkingRole, setCheckingRole] = useState(true);

    const [course, setCourse] = useState({
        title: "",
        desc: "",
        price: "",
        img: "",
    });

    // Fetch role from localStorage
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        console.log("Fetched Role from localStorage:", storedRole);
        setRole(storedRole);
        
        if (storedRole !== "admin") {
            navigate("/");
        } else {
            setCheckingRole(false);
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!course.img.startsWith("http")) {
            setError("Please enter a valid image URL.");
            setLoading(false);
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/courses", course);
            alert("🎉 Course added successfully!");
            navigate("/courses");
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong.");
            console.error("Error adding course:", error);
        } finally {
            setLoading(false);
        }
    };

    if (checkingRole) {
        return <h3 style={{ textAlign: "center", marginTop: "50px" }}>🔄 Checking access...</h3>;
    }

    return (
        <section 
            style={{
                marginLeft: "250px",
                width: "calc(100% - 250px)",
                padding: "30px",
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
            }}
        >
            <div 
                style={{
                    backgroundColor: "#ffffff",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                    maxWidth: "600px",
                    margin: "auto",
                    textAlign: "center"
                }}
            >
                <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#003c8f", marginBottom: "20px" }}>
                    ➕ Add New Course
                </h2>

                {error && (
                    <p style={{ color: "red", fontWeight: "bold", marginBottom: "15px" }}>
                        ❌ {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                    <label>📖 Course Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={course.title} 
                        onChange={handleChange} 
                        required 
                        style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px" }}
                    />

                    <label>📝 Description</label>
                    <textarea 
                        name="desc" 
                        value={course.desc} 
                        onChange={handleChange} 
                        required 
                        style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", height: "100px" }}
                    />

                    <label>💰 Price</label>
                    <input 
                        type="number" 
                        name="price" 
                        value={course.price} 
                        onChange={handleChange} 
                        required 
                        style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px" }}
                    />

                    <label>🖼️ Image URL</label>
                    <input 
                        type="text" 
                        name="img" 
                        value={course.img} 
                        onChange={handleChange} 
                        required 
                        style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px" }}
                    />
                    
                    {course.img && course.img.startsWith("http") && (
                        <div style={{ marginBottom: "15px", textAlign: "center" }}>
                            <img 
                                src={course.img} 
                                alt="Preview" 
                                style={{ width: "100%", height: "200px", borderRadius: "8px", objectFit: "cover" }} 
                            />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ backgroundColor: "#007bff", color: "white", padding: "12px 18px", borderRadius: "8px", width: "100%" }}
                    >
                        {loading ? "Adding..." : "Add Course"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default CreateCourse;
