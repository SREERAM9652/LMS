const express = require("express");
const Assessment = require("../models/Assessment");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Submission = require("../models/Submission");
const mongoose = require("mongoose"); 
const router = express.Router();

// Create an assessment (Only Admin)
router.post("/create", async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debugging log

    const { userId, title, description, courseId, dueDate, questions } = req.body;

    if (!userId || !title || !description || !courseId || !dueDate || !questions) {
      console.log("Missing fields:", { userId, title, description, courseId, dueDate, questions });
      return res.status(400).json({ error: "All fields are required." });
    }

    // Ensure at least one question (since we removed the 5-question limit)
    if (questions.length < 1) {
      console.log("No questions provided.");
      return res.status(400).json({ error: "At least one question is required." });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ error: "User not found." });
    }

    // Check admin role
    if (user.role !== "admin") {
      console.log("Unauthorized user:", userId);
      return res.status(403).json({ error: "Access denied. Only admins can create assessments." });
    }

    // Create new assessment
    const newAssessment = new Assessment({
      title,
      description,
      courseId,
      createdBy: userId,
      dueDate,
      questions,
    });

    await newAssessment.save();
    res.status(201).json({ message: "Assessment created successfully", assessment: newAssessment });
  } catch (error) {
    console.error("Error creating assessment:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});


// Get assessments for a specific course
router.get("/course/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid Course ID format." });
    }

    const assessments = await Assessment.find({ courseId });

    if (!assessments.length) {
      return res.status(404).json({ message: "No assessments found for this course." });
    }

    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});


// ✅ Get ongoing assessments only for enrolled courses
router.get("/ongoing/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all courses the user is enrolled in
    const enrollments = await Enrollment.find({ userId });

    if (enrollments.length === 0) {
      return res.status(200).json([]); // No enrolled courses
    }

    const enrolledCourseIds = enrollments.map(e => e.courseId);

    // Find ongoing assessments for these courses
    const ongoingAssessments = await Assessment.find({
      courseId: { $in: enrolledCourseIds },
      dueDate: { $gte: new Date() },
    });

    res.status(200).json(ongoingAssessments);
  } catch (error) {
    console.error("Error fetching ongoing assessments:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});




// Get all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// ✅ Delete an assessment
// ✅ Delete an assessment by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is in correct MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid assessment ID format." });
    }

    // Find and delete the assessment
    const deletedAssessment = await Assessment.findByIdAndDelete(id);

    if (!deletedAssessment) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    res.status(200).json({ message: "✅ Assessment deleted successfully!" });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Fetch an assessment by ID
router.get("/:assessmentId", async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    // Ensure the ID is valid
    if (!assessmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid assessment ID format" });
    }

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: "Error fetching assessment" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID:", id); // ✅ Debugging log
    console.log("Received body:", req.body); // ✅ Debugging log

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }

    const { title, description, dueDate, questions } = req.body;
    
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      id,
      { title, description, dueDate, questions },
      { new: true }
    );

    if (!updatedAssessment) {
      return res.status(404).json({ error: "Assessment not found." });
    }

    res.json({ message: "Assessment updated successfully", assessment: updatedAssessment });
  } catch (error) {
    console.error("Error updating assessment:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// Get completed assessments by userId
router.get("/completed/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await Submission.find({ userId }).populate("assessmentId");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch completed assessments" });
  }
});

// Get progress report (latest attempt per assessment)
router.get("/progress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 });
    const latestSubmissions = {};

    submissions.forEach((sub) => {
      const key = sub.assessmentId.toString();
      if (!latestSubmissions[key]) {
        latestSubmissions[key] = sub;
      }
    });

    const progressData = await Promise.all(
      Object.values(latestSubmissions).map(async (s) => {
        const assessment = await Assessment.findById(s.assessmentId);
        return {
          assessmentTitle: assessment.title,
          score: s.score,
        };
      })
    );

    res.json(progressData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch progress report" });
  }
});


module.exports = router;