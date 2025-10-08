import React, { useEffect, useState } from "react";
import axios from "axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "student");
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/announcements");
      
      if (response.status === 200) {
        setAnnouncements(response.data);
      } else {
        console.error("Failed to fetch announcements: Unexpected status", response.status);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    if (role) {
      fetchAnnouncements();
    }
  }, [role]);

  if (role === null) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const isAdmin = role === "admin";

  const createAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
  
    const payload = {
      userId: localStorage.getItem("userId"),  // ✅ Ensure userId is included
      title: "New Announcement", // ✅ Add a title (modify as needed)
      description: newAnnouncement, // ✅ Use `description` instead of `text`
    };
  
    console.log("Sending announcement:", payload); // Debugging step
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/announcements/create",
        payload,
        {
          headers: { "Content-Type": "application/json" }, // Ensure JSON format
        }
      );
      setAnnouncements([...announcements, response.data.announcement]); // ✅ Use `announcement`
      setNewAnnouncement("");
    } catch (error) {
      console.error("Error creating announcement:", error.response?.data || error.message);
    }
  };
  

  const updateAnnouncement = async (id) => {
    if (!editText.trim()) return;
  
    const userId = localStorage.getItem("userId");
  
    console.log("Updating announcement with ID:", id); // Debugging step
  
    if (!id) {
      console.error("Error: Announcement ID is undefined.");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/announcements/${id}`,
        {
          userId, 
          title: "Updated Announcement",  // ✅ Ensure title is included
          description: editText, 
        },
        {
          headers: { "Content-Type": "application/json" },
        }
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
    const userId = localStorage.getItem("userId"); // ✅ Retrieve userId
  
    if (!userId) {
      console.error("User ID is missing!");
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
        data: { userId }, // ✅ Include userId in DELETE request
        headers: { "Content-Type": "application/json" }, // Ensure correct format
      });
  
      console.log("Deleted successfully:", response.data);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error.response?.data || error.message);
    }
  };
  

  return (
    <>
      <style>
        {`
          
        
          .main-content {
            margin-left: 250px;
            padding: 20px;
          }

          .container {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
            margin-left:250px;
          }

          .announcements-title {
  font-size: 2.5rem; /* Increase font size */
  font-weight: bold; /* Make it bold */
  color: #007bff; /* Use a primary color */
  text-align: left; /* Center the text */
  margin-bottom: 20px; /* Add space below */
  text-transform: uppercase; /* Uppercase letters */
  letter-spacing: 1.5px; /* Add letter spacing */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow for effect */
  margin-right:300px;
}


          .announcement-card {
            width: 100%;
            max-width: 500px;
            border-radius: 12px;
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            background-color: #ffffff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            margin: auto;
            text-align: center;
            overflow: hidden;
            padding: 20px;
            margin-bottom: 20px;
            margin-top:20px;
            margin-right:400px;
          }

          .announcement-card:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          }

          .announcement-input {
            width: 80%;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #ccc;
            margin-right: 10px;
          }

          .btn-primary {
            background-color: #007bff;
            border: none;
            border-radius: 6px;
            padding: 10px 15px;
            font-size: 1rem;
            transition: background-color 0.3s;
          }

          .btn-primary:hover {
            background-color: #0056b3;
          }

          .btn-danger {
            background-color: #dc3545;
            border: none;
            border-radius: 6px;
            padding: 10px 15px;
            font-size: 1rem;
          }

          .btn-danger:hover {
            background-color: #c82333;
          }

          .announcement-actions {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
          }

          @media screen and (max-width: 768px) {
            .main-content {
              margin-left: 0;
              padding: 15px;
            }
            .announcement-card {
              max-width: 100%;
            }
            .announcement-input {
              width: 100%;
            }
          }
        `}
      </style>
      
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