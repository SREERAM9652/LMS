const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true }, // Image URL
    //video: { type: String, required: false }, // Video URL (optional)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to instructor
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of enrolled students
    createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
