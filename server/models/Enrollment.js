const mongoose = require("mongoose");

// Enrollment schema to track which user is enrolled in which course
const EnrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Reference to the Course model
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

module.exports = Enrollment;
