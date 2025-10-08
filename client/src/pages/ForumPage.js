import React, { useEffect, useState } from "react";
import axios from "axios";

const ForumPage = () => {
  const [forums, setForums] = useState([]);
  const [newForum, setNewForum] = useState({ title: "", description: "", courseId: "" });
  const [courses, setCourses] = useState([]);
  const [replies, setReplies] = useState({});
  const [responses, setResponses] = useState({});
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState();

  useEffect(() => {
    setRole(localStorage.getItem("role") || "student");
    setUserId(localStorage.getItem("userId"));
    setName(localStorage.getItem("name"));
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://lms-2inz.onrender.com/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await axios.get("https://lms-2inz.onrender.com/api/forums");
      setForums(response.data);
    } catch (error) {
      console.error("Error fetching forums:", error);
    }
  };

  useEffect(() => {
    fetchForums();
  }, [role]);

  const createForum = async () => {
    if (!newForum.title.trim() || !newForum.description.trim() || !newForum.courseId.trim()) {
      return;
    }
    try {
      const response = await axios.post("https://lms-2inz.onrender.com/api/forums/create", { ...newForum, userId });
      setForums([...forums, response.data]);
      setNewForum({ title: "", description: "", courseId: "" });
    } catch (error) {
      console.error("Error creating forum:", error);
    }
  };

  const postReply = async (forumId) => {
    if (!replies[forumId]) return;
    
    console.log("Posting reply as userId:", userId); // Debugging line
    
    try {
      const response = await axios.post(
        `https://lms-2inz.onrender.com/api/forums/${forumId}/reply`,
        { text: replies[forumId], userId },  // Ensure userId is included
        { headers: { "Content-Type": "application/json" } }
      );
      fetchForums();
      setReplies({ ...replies, [forumId]: "" });
    } catch (error) {
      console.error("Error posting reply:", error.response?.data || error.message);
    }
  };
  

  const deleteReply = async (forumId, replyId, replyUserId) => {
    if (replyUserId !== userId && role !== "admin" && role !== "instructor") return;
    try {
      await axios.delete(`https://lms-2inz.onrender.com/api/forums/${forumId}/reply/${replyId}`, {
        data: { userId, role },
      });
      fetchForums();
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const deleteForum = async (forumId) => {
    try {
        await axios.delete(`https://lms-2inz.onrender.com/api/forums/${forumId}`, {
            data: { userId }, // Send user ID for authorization
        });
        fetchForums(); // Refresh forums after deletion
    } catch (error) {
        console.error("Error deleting forum:", error);
    }
};

const deleteResponse = async (forumId, replyId, responseId) => {
    try {
      await axios.delete(`https://lms-2inz.onrender.com/api/forums/${forumId}/reply/${replyId}/response/${responseId}`, {
        headers: { "Content-Type": "application/json" }, // <-- Add this
        data: { userId, role }, // Send userId for authentication
      });
      fetchForums(); // Refresh the forum after deletion
    } catch (error) {
      console.error("Error deleting response:", error.response?.data || error.message);
    }
  };
  
  

  const respondToReply = async (forumId, replyId) => {
    if (!responses[replyId]) return;
    try {
        await axios.post(`https://lms-2inz.onrender.com/api/forums/${forumId}/reply/${replyId}/respond`, { text: responses[replyId], adminId: userId });

      fetchForums();
      setResponses({ ...responses, [replyId]: "" });
    } catch (error) {
      console.error("Error responding to reply:", error);
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
            margin-left: 250px;
          }

          .forums-title {
            font-size: 2.5rem;
            font-weight: bold;
            color: #007bff;
            text-align: left;
            margin-bottom: 20px;
          }

          .forum-card {
            width: 100%;
            max-width: 500px;
            border-radius: 12px;
            background-color: #ffffff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            margin: auto;
            text-align: center;
            padding: 20px;
            margin-bottom: 20px;
            margin-top:20px;
          }

          .forum-input {
            width: 80%;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #ccc;
            margin-right: 10px;
            margin-top:10px;
          }

          .btn-primary {
            background-color: #007bff;
            border: none;
            border-radius: 6px;
            padding: 10px 15px;
            margin-right:10px;
            margin-top:10px;
          }

          .btn-danger {
            background-color: #dc3545;
            border: none;
            border-radius: 6px;
            padding: 10px 15px;
            margin-top:10px;
            margin-left:10px;
          }

          .reply-section {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
          }

            .forum-header {
  display: flex;
  justify-content: space-between;  /* Push delete button to right */
  align-items: center;
  padding: 10px;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: red;
}

.delete-btn:hover {
  color: darkred;
}

.response-item {
  background: #e9ecef;
  padding: 8px;
  border-radius: 5px;
  margin-top: 5px;
  display: flex;
  justify-content: space-between; /* Align X button to the right */
  align-items: center;
}

.delete-response-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: red;
  cursor: pointer;
}

.delete-response-btn:hover {
  color: darkred;
}



        `}
      </style>
      
      <section className="container main-content mt-5">
        <h1 className="forums-title">Course Forums</h1>

        {role === "admin" || role === "instructor" ? (
          <div className="text-center mb-4">
            <input type="text" className="forum-input" value={newForum.title} onChange={(e) => setNewForum({ ...newForum, title: e.target.value })} placeholder="Forum Title" />
            <input type="text" className="forum-input" value={newForum.description} onChange={(e) => setNewForum({ ...newForum, description: e.target.value })} placeholder="Forum Description" />
            <select className="forum-input" value={newForum.courseId} onChange={(e) => setNewForum({ ...newForum, courseId: e.target.value })}>
              <option value="">Select Course</option>
              {courses.map((course) => (<option key={course._id} value={course._id}>{course.title}</option>))}
            </select>
            <button className="btn btn-primary" onClick={createForum}>Create Forum</button>
          </div>
        ) : null}

        {forums.map((forum) => (
          <div key={forum._id} className="forum-card">
            <div className="forum-header">
      <h3>{forum.title}</h3>

      {(role === "admin" || role === "instructor") && (
        <button className="delete-btn" onClick={() => deleteForum(forum._id)}>
          🗑️
        </button>
      )}
    </div>

            <p>{forum.description}</p>
            <div>
              <input type="text" className="forum-input" value={replies[forum._id] || ""} onChange={(e) => setReplies({ ...replies, [forum._id]: e.target.value })} placeholder="Write a reply..." />
              <button className="btn btn-primary" onClick={() => postReply(forum._id)}>Reply</button>
            </div>

            {forum.replies && forum.replies.map((reply) => (
              <div key={reply._id} className="reply-section">
                <p>{reply.text} - <i>by {reply.user.fullName}</i></p>

    {reply.responses && reply.responses.length > 0 && (
      <div className="response-section">
        <strong>Admin Responses:</strong>
        {reply.responses.map((response) => (
          <div key={response._id} className="response-item">
            <p>{response.text} - <i>by {response.admin?.fullName || "Admin"}</i></p>
        {(role === "admin" || role === "instructor") && (
          <button className="delete-response-btn" onClick={() => deleteResponse(forum._id, reply._id, response._id)}>
            ❌
          </button>
        )}
          </div>
        ))}
      </div>
    )}

                {(role === "admin" || role === "instructor") && (
                <>
                  <input
                    type="text"
                    className="forum-input"
                    value={responses[reply._id] || ""}
                    onChange={(e) => setResponses({ ...responses, [reply._id]: e.target.value })}
                    placeholder="Respond to reply..."
                  />
                  <button className="btn btn-primary" onClick={() => respondToReply(forum._id, reply._id)}>
                    Respond
                  </button>
                </>
              )}

                {(reply.user._id === userId || role === "admin" || role === "instructor") && (
                  <button className="btn btn-danger" onClick={() => deleteReply(forum._id, reply._id, reply.user._id)}>Delete</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </section>
    </>
  );
};

export default ForumPage;
