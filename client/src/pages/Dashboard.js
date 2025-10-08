import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    const [users, setUsers] = useState([]);
    const [assessments, setAssessments] = useState([]);

    // If the user is an admin, navigate to Admin Dashboard
    useEffect(() => {
        if (role === "admin") {
            navigate("/admin/dashboard"); // Redirect to Admin Dashboard
        }
    }, [role, navigate]);

    // Fetch data for student dashboard
    useEffect(() => {
        if (role === "student") {
            axios.get("/api/assessments")
                .then(res => setAssessments(res.data))
                .catch(err => console.error("Failed to fetch assessments", err));
        }
    }, [role]);

    // Student dashboard cards
    const studentItems = [
        {
            title: "📚 My Courses",
            desc: "View and manage your enrolled courses.",
            path: `/enrolled-courses/${userId}`,
        },
        {
            title: "📝 Assignments",
            desc: "Check and submit your assignments on time.",
            path: "/assessments",
        },
        {
            title: "📊 Progress Report",
            desc: "Track your learning progress and performance.",
            path: "/assessments/analytics",
        },
    ];

    // Student Dashboard UI
    if (role === "student") {
        return (
            <section className="container mt-5">
                <h1 className="text-center">Student Dashboard</h1>
                <div className="row">
                    {studentItems.map((item, index) => (
                        <div key={index} className="col-lg-4 col-md-6 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{item.title}</h5>
                                    <p className="card-text flex-grow-1">{item.desc}</p>
                                    <button
                                        className="btn btn-primary mt-auto"
                                        onClick={() => navigate(item.path)}
                                    >
                                        Go to {item.title.split(" ")[1]}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // Fallback if no valid role is found
    return <p>Unauthorized access</p>;
};

export default Dashboard;
