import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch enrolled courses for the logged-in student
    useEffect(() => {
        const studentId = localStorage.getItem("userId");
        if (!studentId) return alert("User ID is missing.");

        fetch(`http://localhost:5000/api/enrolled-courses/${studentId}`)
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching enrolled courses:", err);
                setLoading(false);
            });
    }, []);

    // Unenroll from a course
    const handleUnenroll = async (courseId) => {
        const studentId = localStorage.getItem("userId");
        if (!studentId) return alert("User ID is missing.");
    
        try {
            const response = await fetch("http://localhost:5000/api/unenroll-course", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: studentId, courseId }), // Ensure 'userId' and 'courseId' are in the body
            });
    
            if (response.ok) {
                alert("Unenrolled successfully!");
                setCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId));
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
                alert(`Error unenrolling from course: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error unenrolling from course:", error);
            alert("There was an issue with the network request.");
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
                    📜 Enrolled Courses
                </h2>
            </div>

            {loading ? (
                <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>⏳ Loading your enrolled courses...</p>
            ) : courses.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)", // 3 cards per row
                        gap: "20px",
                        justifyContent: "center",
                    }}
                >
                    {courses.map((course) => (
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
                                width: "300px", // Set a fixed width for consistency
                                height: "450px", // Increased height to accommodate button inside card
                                justifyContent: "space-between", // Ensures the content inside is spaced
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
                            <h3 style={{ fontSize: "22px", color: "#003c8f", margin: "15px 0 10px" }}>
                                {course.title}
                            </h3>
                            <p style={{
                                fontSize: "14px",
                                color: "#555",
                                marginBottom: "15px",
                                textAlign: "center"
                            }}>
                                {course.desc}
                            </p>
                            <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                                <strong>Price:</strong> {course.price}
                            </p>

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
                                    marginTop: "auto", // Pushes the button to the bottom of the card
                                }}
                                onClick={() => handleUnenroll(course._id)}
                            >
                                Unenroll
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>
                    😔 You are not enrolled in any courses yet.
                </p>
            )}
        </section>
    );
};

export default EnrolledCourses;
