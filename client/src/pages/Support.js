import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../App.css";

const Support = () => {
  const navigate = useNavigate(); // React Router navigation

  const supportData = [
    { title: "❓ FAQs", desc: "Find answers to frequently asked questions.", path: "/support/faqs" },
    { title: "📩 Contact Support", desc: "Reach out to our support team for help.", path: "/support/contact" },
    { title: "💡 User Guides", desc: "Explore tutorials and documentation.", path: "/support/guides" },
    { title: "⚠️ Report an Issue", desc: "Report bugs or any technical problems.", path: "/support/report" },
  ];

  return (
    <section className="container mt-5">
      <h1 className="text-center">Help & Support</h1>
      <div className="row">
        {supportData.map((data, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{data.title}</h5>
                <p className="card-text flex-grow-1">{data.desc}</p>
                <button className="btn btn-primary mt-auto" onClick={() => navigate(data.path)}>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Support;
