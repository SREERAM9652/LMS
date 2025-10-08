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

// ✅ Root route (fix "Cannot GET /")
app.get("/", (req, res) => {
  res.send("✅ LMS Backend API is running...");
});

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

// ✅ Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connection Successful");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Stop server if DB connection fails
  });
