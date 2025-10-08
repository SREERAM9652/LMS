const mongoose = require("mongoose");

const ForumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Linked to a course
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Instructor or admin who created the forum
    createdAt: { type: Date, default: Date.now },
    replies: [
        {
            text: { type: String, required: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student who replied
            createdAt: { type: Date, default: Date.now },
            responses: [
                {
                    text: { type: String, required: true },
                    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin/instructor response
                    createdAt: { type: Date, default: Date.now },
                },
            ],
        },
    ],
});

const Forum = mongoose.model("Forum", ForumSchema);
module.exports = Forum;
