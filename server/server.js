const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollRoutes");
const assessmentRoutes = require("./routes/assessmentsRoutes");
const submissionRoutes = require("./routes/submissionsRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const replyRoutes = require("./routes/replyRoutes");
const likeRoutes = require("./routes/likeRoutes");
const announcementsRoutes = require("./routes/announcementsRoutes");
const forumRoutes = require("./routes/forumRoutes");
const adminDashboardRoutes = require("./routes/adminDashboard");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use(enrollmentRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/forums", forumRoutes);
app.use("/api/admin", adminDashboardRoutes);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connection Successful"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Stop server if DB connection fails
  });

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = mongoose;
