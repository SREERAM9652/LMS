import React, { useState, useEffect } from "react";
import axios from "axios";

const GeneralDiscussions = () => {
    const [discussions, setDiscussions] = useState([]);
    const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" });
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [newReply, setNewReply] = useState("");

    useEffect(() => {
        fetchDiscussions();
    }, []);

    const fetchDiscussions = async () => {
        try {
            const res = await axios.get("https://lms-2inz.onrender.com/api/discussions");
            setDiscussions(res.data);
        } catch (error) {
            console.error("Error fetching discussions:", error);
        }
    };

    const handleCreateDiscussion = async () => {
        if (!newDiscussion.title || !newDiscussion.content) {
            return alert("Please enter all fields");
        }
    
        try {
            const userId = localStorage.getItem("userId");
    
            await axios.post("https://lms-2inz.onrender.com/api/discussions", {
                title: newDiscussion.title,
                content: newDiscussion.content,
                author: userId,
                category: "General Discussions",  // Explicitly setting category
            });
    
            setNewDiscussion({ title: "", content: "", category: "General Discussions" });  // Reset state properly
            fetchDiscussions();
        } catch (error) {
            console.error("Error creating discussion:", error.response?.data || error);
        }
    };

    const handleDeleteDiscussion = async (discussionId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this discussion?");
        if (!confirmDelete) return;
    
        try {
            await axios.delete(`https://lms-2inz.onrender.com/api/discussions/${discussionId}`);
            setDiscussions(discussions.filter(d => d._id !== discussionId));
        } catch (error) {
            console.error("Error deleting discussion:", error);
        }
    };
    
    const handleReply = async (discussionId) => {
        if (!newReply) return alert("Enter a reply");
        try {
            const userId = localStorage.getItem("userId");

            await axios.post("https://lms-2inz.onrender.com/api/replies", {
                content: newReply,
                author: userId,
                discussion: discussionId
            });

            setNewReply("");
            fetchDiscussions();
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    };

    const handleDeleteReply = async (replyId, discussionId) => {
        try {
            await axios.delete(`https://lms-2inz.onrender.com/api/replies/${replyId}`);
            setDiscussions(discussions.map(discussion => {
                if (discussion._id === discussionId) {
                    return {
                        ...discussion,
                        replies: discussion.replies.filter(reply => reply._id !== replyId)
                    };
                }
                return discussion;
            }));
        } catch (error) {
            console.error("Error deleting reply:", error);
        }
    };

    const handleReplyClick = async (discussionId) => {
        setSelectedDiscussion(discussionId);
        
        try {
            const res = await axios.get(`https://lms-2inz.onrender.com/api/discussions/${discussionId}`);
            const updatedDiscussion = res.data;
            
            setDiscussions((prev) => 
                prev.map((d) => d._id === discussionId ? updatedDiscussion : d)
            );
        } catch (error) {
            console.error("Error fetching discussion with replies:", error);
        }
    };
    

    const handleLike = async (discussionId) => {
        try {
            const userId = localStorage.getItem("userId");
    
            const res = await axios.post("https://lms-2inz.onrender.com/api/likes", { 
                user: userId, 
                targetId: discussionId, 
                targetType: "Discussion" 
            });
    
            const { liked, userId: returnedUserId } = res.data;
    
            setDiscussions((prevDiscussions) =>
                prevDiscussions.map((discussion) => {
                    if (discussion._id === discussionId) {
                        let updatedLikes = liked
                            ? [...(discussion.likes || []), returnedUserId]
                            : (discussion.likes || []).filter((id) => id !== returnedUserId);
    
                        return { ...discussion, likes: updatedLikes };
                    }
                    return discussion;
                })
            );
        } catch (error) {
            console.error("Error toggling like:", error.response?.data || error);
        }
    };
    
    
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>💬 General Discussions</h1>

            <div style={styles.form}>
                <input
                    type="text"
                    placeholder="Discussion Title"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    style={styles.input}
                />
                <textarea
                    placeholder="Discussion Content"
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    style={styles.textarea}
                />
                <button onClick={handleCreateDiscussion} style={styles.button}>Start Discussion</button>
            </div>

            <div style={styles.discussionsList}>
                {discussions.map((discussion) => (
                    <div key={discussion._id} style={styles.discussionCard}>
                        <div style={styles.header}>
                            <h3>{discussion.title}</h3>
                            <span style={styles.deleteIcon} onClick={() => handleDeleteDiscussion(discussion._id)}>🗑️</span>
                        </div>
                        <p>{discussion.content}</p>
                        <p><strong>Author:</strong> {discussion.author?.fullName || "Unknown"}</p>
                        <div style={styles.actions}>
                            <button onClick={() => handleLike(discussion._id)} style={styles.likeButton}>👍 {discussion.likes?.length || 0}</button>
                            {selectedDiscussion === discussion._id ? (
                                <button onClick={() => setSelectedDiscussion(null)} style={styles.cancelReplyButton}>
                                    ❌ Cancel Reply
                                </button>
                            ) : (
                                <button onClick={() => setSelectedDiscussion(discussion._id)} style={styles.replyButton}>
                                    💬 Reply
                                </button>
                            )}
                        </div>

                        <div style={styles.replySection}>
                            {discussion.replies?.map((reply) => (
                                <div key={reply._id} style={styles.replyContainer}>
                                    <p style={styles.reply}>
                                        <strong>{reply.author?.fullName || "Anonymous"}:</strong> {reply.content}
                                    </p>
                                    <button 
                                        onClick={() => handleDeleteReply(reply._id, discussion._id)} 
                                        style={styles.deleteReplyButton}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            ))}
                        </div>

                        {selectedDiscussion === discussion._id && (
                            <div style={styles.replyInputSection}>
                                <textarea
                                    placeholder="Write a reply..."
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    style={styles.textarea}
                                />
                                <button onClick={() => handleReply(discussion._id)} style={styles.replyButton}>
                                    ➤ Submit Reply
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginLeft: "250px",
        padding: "30px",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        alignSelf: "flex-start",
        marginLeft: "50px",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#003c8f",
    },
    form: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
        width: "90%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "16px",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "16px",
    },
    button: {
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        background: "#003c8f",
        color: "white",
        cursor: "pointer",
        fontSize: "16px",
    },
    discussionsList: {
        width: "90%",
        maxWidth: "600px",
        marginTop: "20px",
    },
    discussionCard: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
        marginBottom: "15px",
    },
    actions: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
    },
    likeButton: {
        padding: "6px 10px",
        borderRadius: "8px",
        background: "#28a745",
        color: "white",
    },
    replyButton: {
        padding: "6px 10px",
        borderRadius: "8px",
        background: "#003c8f",
        color: "white",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    deleteIcon: {
        cursor: "pointer",
        fontSize: "18px",
        color: "red",
    },
    replyContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#f1f1f1",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "5px",
    },
    deleteReplyButton: {
        background: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
    },
};

export default GeneralDiscussions;
