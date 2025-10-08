const mongoose = require("mongoose");


const AssessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Link to course
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin who created it
  dueDate: { type: Date, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }], // Array of options
      correctAnswer: { type: String, required: true }, // Correct answer
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Assessment = mongoose.model("Assessment", AssessmentSchema);
module.exports = Assessment;
