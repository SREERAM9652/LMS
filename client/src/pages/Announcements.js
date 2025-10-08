import React, { useEffect, useState } from "react";
import axios from "axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [role, setRole] = useState(null);

  const API_BASE = process.env.REACT_APP_BACKEND_URI; // ✅ Use environment variable

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "student");
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/announcements`);
      if (response.status === 200) setAnnouncements(response.data);
      else console.error("Failed to fetch announcements:", response.status);
    } catch (error) {
      console.error("Error fetching announcements:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (role) fetchAnnouncements();
  }, [role]);

  if (role === null) return <div className="text-center mt-5">Loading...</div>;

  const isAdmin = role === "admin";

  const createAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;

    const payload = {
      userId: localStorage.getItem("userId"),
      title: "New Announcement",
      description: newAnnouncement,
    };

    try {
      const response = await axios.post(
        `${API_BASE}/api/announcements/create`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      setAnnouncements([...announcements, response.data.announcement]);
      setNewAnnouncement("");
    } catch (error) {
      console.error("Error creating announcement:", error.response?.data || error.message);
    }
  };

  const updateAnnouncement = async (id) => {
    if (!editText.trim()) return;
    const userId = localStorage.getItem("userId");
    if (!id) return console.error("Announcement ID is undefined.");

    try {
      const response = await axios.put(
        `${API_BASE}/api/announcements/${id}`,
        { userId, title: "Updated Announcement", description: editText },
        { headers: { "Content-Type": "application/json" } }
      );
      setAnnouncements(
        announcements.map((a) => (a._id === id ? response.data.announcement : a))
      );
      setEditing(null);
    } catch (error) {
      console.error("Error updating announcement:", error.response?.data || error.message);
    }
  };

  const deleteAnnouncement = async (id) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return console.error("User ID is missing!");

    try {
      const response = await axios.delete(`${API_BASE}/api/announcements/${id}`, {
        data: { userId },
        headers: { "Content-Type": "application/json" },
      });
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <section className="container main-content mt-5">
        <h1 className="announcements-title">Announcements</h1>

        {isAdmin && (
          <div className="text-center mb-4">
            <input
              type="text"
              className="announcement-input"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="New Announcement"
            />
            <button className="btn btn-primary" onClick={createAnnouncement}>Post</button>
          </div>
        )}

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {announcements.map((a) => (
            <li key={a._id} className="announcement-card">
              <p>{a.description}</p>
              <small>Posted on: {new Date(a.date).toLocaleString()}</small>
              {isAdmin && (
                <div className="announcement-actions">
                  {editing === a._id ? (
                    <>
                      <input
                        type="text"
                        className="announcement-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button className="btn btn-primary" onClick={() => updateAnnouncement(a._id)}>Save</button>
                      <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary" onClick={() => { setEditing(a._id); setEditText(a.description); }}>Edit</button>
                      <button className="btn btn-danger" onClick={() => deleteAnnouncement(a._id)}>Delete</button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Announcements;
