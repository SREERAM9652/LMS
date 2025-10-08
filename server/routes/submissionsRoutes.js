const express = require("express");
const Submission = require("../models/Submission");
const Assessment = require("../models/Assessment");
const User = require("../models/User");

const router = express.Router();

// Submit an assessment
router.post("/submit", async (req, res) => {
  try {
    const { userId, assessmentId, courseId, answers } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ error: "Assessment not found" });

    let score = 0;
    answers.forEach(answer => {
      const question = assessment.questions.find(q => q._id.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    });

    const newSubmission = new Submission({
      assessmentId,
      userId,
      courseId,
      answers,
      score
    });

    await newSubmission.save();
    res.status(201).json({ message: "Submission successful", newSubmission });
  } catch (error) {
    res.status(500).json({ error: "Error submitting assessment" });
  }
});

// Get all submissions for a specific assessment (Only Admin)
router.get("/:assessmentId", async (req, res) => {
  try {
    const { userId } = req.query;
    const { assessmentId } = req.params;

    // Check if user exists and is an admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only admins can view submissions." });
    }

    const submissions = await Submission.find({ assessmentId }).populate("userId", "fullName email");

    if (!submissions.length) {
      return res.status(404).json({ message: "No submissions found for this assessment." });
    }

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching submissions" });
  }
});

module.exports = router;
