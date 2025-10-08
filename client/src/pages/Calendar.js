import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "../App.css";

const Calendar = ({ role }) => {
    const navigate = useNavigate(); // React Router navigation

    const calendarEvents = [
      { title: "📅 Upcoming Events", desc: "View and manage upcoming academic events.", path: "/calendar/events" },
      { title: "📝 Assignment Deadlines", desc: "Keep track of upcoming submission dates.", path: "/calendar/deadlines" },
      { title: "📊 Exam Schedule", desc: "Check important exam dates and times.", path: "/calendar/exams" },
    ];
  
    if (role !== "student") {
      calendarEvents.push({ title: "📌 Schedule Meetings", desc: "Plan and organize meetings with students or staff.", path: "/calendar/meetings" });
    }
  
    return (
      <section className="container mt-5">
        <h1 className="text-center">Academic Calendar</h1>
        <div className="row">
          {calendarEvents.map((event, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text flex-grow-1">{event.desc}</p>
                  <button 
                    className="btn btn-primary mt-auto"
                    onClick={() => navigate(event.path)} // Navigate to the respective page
                  >
                    {event.title.includes("Schedule Meetings") ? "Schedule Now" : "View Calendar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
};

export default Calendar;
