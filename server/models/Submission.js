const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      selectedAnswer: { type: String, required: true }
    }
  ],
  attemptedAt: { type: Date, default: Date.now },

  score: { type: Number, default: null }, // Null until graded
  feedback: { type: String, default: "" }
});

const Submission = mongoose.model("Submission", SubmissionSchema);
module.exports = Submission;
