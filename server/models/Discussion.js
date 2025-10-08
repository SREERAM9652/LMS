const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { 
    type: String, 
    enum: ["General Discussions", "Help & Queries", "Course", "Announcements"], 
    required: true 
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }], // ✅ Add this line
  createdAt: { type: Date, default: Date.now },
});

const Discussion = mongoose.model("Discussion", DiscussionSchema);
module.exports = Discussion;
