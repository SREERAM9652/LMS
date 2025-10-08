import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
    const navigate = useNavigate();
    const [coursesData, setCoursesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]); // to track enrolled courses

    // Fetch role from localStorage
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    // Fetch courses data from API
    useEffect(() => {
        fetch("http://localhost:5000/api/courses")
            .then((res) => res.json())
            .then((data) => {
                setCoursesData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching courses:", err);
                setLoading(false);
            });
    }, []);

    // Fetch enrolled courses for the logged-in student
    useEffect(() => {
        if (role === "student") {
            const userId = localStorage.getItem("userId"); // Use userId
            if (userId) {
                fetch(`http://localhost:5000/api/enrolled-courses/${userId}`)
                    .then((res) => res.json())
                    .then((data) => setEnrolledCourses(data))
                    .catch((err) => console.error("Error fetching enrolled courses:", err));
            }
        }
    }, [role]);

    const handleEnroll = async (courseId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("User ID is missing.");

    try {
        const response = await fetch("http://localhost:5000/api/enroll-course", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, courseId }),
        });

        if (response.ok) {
            alert("Enrolled successfully!");
            setEnrolledCourses((prev) => [...prev, courseId]);
        } else {
            const errorResponse = await response.text();
            alert("Error enrolling in course: " + errorResponse);
        }
    } catch (error) {
        console.error("Error enrolling in course:", error);
        alert("Error enrolling in course.");
    }
};


    // Handle delete action for admins
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setCoursesData((prevCourses) => prevCourses.filter((course) => course._id !== id));
                alert("Course deleted successfully");
            } else {
                alert("Failed to delete course");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    // Handle edit action for admins
    const handleEdit = (id) => {
        navigate(`/edit-course/${id}`);
    };

    // Handle course creation (admin)
    const handleAddCourse = () => {
        console.log("Navigating to create-course");
        navigate("/create-course");
    };

    if (role === null) {
        return <p>Loading...</p>;
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "30px",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "100%",
                }}
            >
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#003c8f", margin: "0" }}>
                    📚 Available Courses
                </h2>
                {role === "admin" && (
                    <button
                        style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                            padding: "12px 18px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            marginLeft: "auto",
                        }}
                        onClick={handleAddCourse}
                    >
                        ➕ Add Course
                    </button>
                )}
            </div>

            {loading ? (
                <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>⏳ Loading courses...</p>
            ) : coursesData.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                        justifyContent: "center",
                    }}
                >
                    {coursesData.map((course) => (
                        <div
                            key={course._id}
                            style={{
                                background: "#ffffff",
                                padding: "20px",
                                borderRadius: "12px",
                                textAlign: "center",
                                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <img
                                src={course.img}
                                alt={course.title}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    borderRadius: "10px",
                                    objectFit: "cover",
                                }}
                            />
                            <h3 style={{ fontSize: "22px", color: "#003c8f", margin: "15px 0 10px" }}>{course.title}</h3>
                            <p style={{ fontSize: "14px", color: "#555", marginBottom: "15px", textAlign: "center" }}>
                                {course.desc}
                            </p>
                            <p><strong>Price:</strong> {course.price}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                {role === "student" && (
                                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                        {!enrolledCourses.includes(course._id) && (
                                            <button
                                                style={{
                                                    backgroundColor: "#007bff",
                                                    color: "white",
                                                    padding: "10px 14px",
                                                    borderRadius: "6px",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                    border: "none",
                                                }}
                                                onClick={() => handleEnroll(course._id)}
                                            >
                                                Enroll Now
                                            </button>
                                        )}
                                    </div>
                                )}

                                {role === "admin" && (
                                    <>
                                        <button
                                            style={{
                                                backgroundColor: "#ffc107",
                                                color: "black",
                                                padding: "10px 14px",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                border: "none",
                                            }}
                                            onClick={() => handleEdit(course._id)}
                                        >
                                            ⚙️ Edit
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: "#dc3545",
                                                color: "white",
                                                padding: "10px 14px",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                border: "none",
                                            }}
                                            onClick={() => handleDelete(course._id)}
                                        >
                                            ❌ Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: "center", fontSize: "18px", color: "#666", padding: "40px", background: "#ffffff", borderRadius: "10px" }}>
                    <p>😔 No courses available at the moment.</p>
                    {role === "admin" && (
                        <button
                            style={{
                                backgroundColor: "#28a745",
                                color: "white",
                                fontSize: "16px",
                                fontWeight: "bold",
                                padding: "12px 18px",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                            onClick={handleAddCourse}
                        >
                            ➕ Add a Course
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default Courses;
