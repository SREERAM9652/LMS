const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Course = require("../models/Course");
const User = require("../models/User");
const Assessment = require("../models/Assessment");
const Submission = require("../models/Submission");

// Middleware to verify admin
const isAdmin = async (req, res, next) => {
  const { userId } = req.query; // pass userId as query param
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  next();
};

// Admin dashboard metrics
router.get("/summary", isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    res.json({
      totalUsers,
      totalCourses,
      totalAssessments,
      totalSubmissions,
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ error: "Failed to fetch admin summary" });
  }
});

// View all users (optional)
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// View all courses
router.get("/courses", isAdmin, async (req, res) => {
  try {
    const courses = await Course.find().populate("createdBy", "fullName email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// View all assessments
router.get("/assessments", isAdmin, async (req, res) => {
  try {
    const assessments = await Assessment.find().populate("courseId", "title");
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});

// View all submissions
router.get("/submissions", isAdmin, async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("userId", "fullName")
      .populate("assessmentId", "title");

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

module.exports = router;
