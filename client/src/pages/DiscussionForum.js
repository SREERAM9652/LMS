import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../App.css";

const DiscussionForum = ({ role }) => {
    const navigate = useNavigate(); // React Router navigation

    const forumItems = [
        { title: "💬 General Discussions", desc: "Engage in open discussions with peers.", path: "/forum/general" },
        { title: "📚 Course Forums", desc: "Discuss topics related to your enrolled courses.", path: "/forum/courses" },
        //{ title: "❓ Help & Queries", desc: "Ask questions and get help from the community.", path: "/forum/help" },
    ];

    if (role !== "student") {
        forumItems.push({ title: "📢 Announcements", desc: "Post important updates for students.", path: "/forum/announcements" });
    }

    return (
        <section className="container mt-5">
            <h1 className="text-center">Discussion Forum</h1>
            <div className="row">
                {forumItems.map((item, index) => (
                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text flex-grow-1">{item.desc}</p>
                                <button 
                                    className="btn btn-primary mt-auto"
                                    onClick={() => navigate(item.path)} // Navigate dynamically
                                >
                                    {item.title.includes("Announcements") ? "Manage Announcements" : "Join Discussion"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DiscussionForum;
