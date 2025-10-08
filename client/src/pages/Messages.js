import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../App.css";

const Messages = ({ role }) => {
  const navigate = useNavigate(); // React Router navigation

  const messageItems = [
    { title: "📥 Inbox", desc: "Check your received messages.", path: "/messages/inbox" },
    { title: "📤 Sent", desc: "View your sent messages.", path: "/messages/sent" },
    { title: "🗑️ Trash", desc: "Manage deleted messages.", path: "/messages/trash" },
  ];

  if (role !== "student") {
    messageItems.push({ title: "📢 Announcements", desc: "Send important updates to students.", path: "/messages/announcements" });
  }

  return (
    <section className="container mt-5">
      <h1 className="text-center">Messages</h1>
      <div className="row">
        {messageItems.map((item, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text flex-grow-1">{item.desc}</p>
                <button className="btn btn-primary mt-auto" onClick={() => navigate(item.path)}>
                  {item.title.includes("Announcements") ? "Manage Announcements" : "Open"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Messages;
