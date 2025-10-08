const express = require("express");
const Forum = require("../models/Forum");
const User = require("../models/User");
const Course = require("../models/Course");

const router = express.Router();

// Create a new forum (Admin or Instructor only)
// Create a new forum (Admins or Instructors only)
router.post("/create", async (req, res) => {
    try {
        const { title, description, courseId, userId } = req.body;

        console.log("Received userId:", userId);
        console.log("Received courseId:", courseId);  // Log for debugging

        if (!userId) {
            return res.status(403).json({ error: "User ID is missing." });
        }

        if (!courseId) {
            return res.status(400).json({ error: "Course ID is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "Invalid user." });
        }

        if (user.role !== "admin" && user.role !== "instructor") {
            return res.status(403).json({ error: "Only admins or instructors can create forums." });
        }

        const newForum = new Forum({ title, description, course: courseId, createdBy: userId });
        await newForum.save();

        res.status(201).json(newForum);
    } catch (error) {
        console.error("Error creating forum:", error);
        res.status(500).json({ error: "Server error." });
    }
});


// Post a reply (Students only)
// Add a reply to a forum
router.post("/:forumId/reply", async (req, res) => {
    try {
        const { text, userId } = req.body;

        if (!userId) return res.status(403).json({ message: "User ID is required" });

        const user = await User.findById(userId);
        if (!user) return res.status(403).json({ message: "User not found" });

        if (user.role !== "student") {
            return res.status(403).json({ message: "Only students can reply to forums." });
        }

        const forum = await Forum.findById(req.params.forumId);
        if (!forum) return res.status(404).json({ message: "Forum not found" });

        const newReply = { text, user: userId };
        forum.replies.push(newReply);
        await forum.save();

        res.status(201).json({ message: "Reply added successfully", forum });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Admin response to a reply
// Admin response to a reply
router.post("/:forumId/reply/:replyId/respond", async (req, res) => {
    try {
        const { text, adminId } = req.body;

        if (!text || !adminId) {
            return res.status(400).json({ message: "Text and adminId are required" });
        }

        const forum = await Forum.findById(req.params.forumId);
        if (!forum) {
            return res.status(404).json({ message: "Forum not found" });
        }

        const reply = forum.replies.id(req.params.replyId);
        if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
        }

        // Ensure responses array exists
        if (!reply.responses) {
            reply.responses = [];
        }

        reply.responses.push({
            text,
            admin: adminId,
            createdAt: new Date(),
        });

        await forum.save();

        res.status(201).json({ message: "Response added successfully", forum });
    } catch (error) {
        console.error("Error responding to reply:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Delete a reply (students can delete their own, admins can delete any)
router.delete("/:forumId/reply/:replyId", async (req, res) => {
    try {
        const { userId, role } = req.body;
        const forum = await Forum.findById(req.params.forumId);
        if (!forum) return res.status(404).json({ message: "Forum not found" });

        const reply = forum.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        if (reply.user.toString() !== userId && role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        reply.deleteOne();
        await forum.save();
        res.json({ message: "Reply deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all forums
// Get all forums with proper user and course details
router.get("/", async (req, res) => {
    try {
        const forums = await Forum.find()
            .populate("createdBy", "fullName")  // Populate forum creator's name
            .populate({
                path: "replies.user",
                select: "fullName",  // Populate only the user's name in replies
            })
            .populate({
                path: "replies.responses.admin", // Populate admin inside responses
                select: "fullName",
            })
            .populate("course", "title");  // Populate the course title

        res.status(200).json(forums);
    } catch (error) {
        console.error("Error fetching forums:", error);
        res.status(500).json({ message: "Error fetching forums", error: error.message });
    }
});

router.delete("/:forumId", async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user || (user.role !== "admin" && user.role !== "instructor")) {
            return res.status(403).json({ message: "Unauthorized: Only admins or instructors can delete forums" });
        }

        const forum = await Forum.findById(req.params.forumId);
        if (!forum) return res.status(404).json({ message: "Forum not found" });

        await Forum.findByIdAndDelete(req.params.forumId);
        res.json({ message: "Forum deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Delete a response (Admin/Instructors only)
router.delete("/:forumId/reply/:replyId/response/:responseId", async (req, res) => {
    try {
      const { forumId, replyId, responseId } = req.params;
      const { userId, role } = req.body;
  
      console.log(`Deleting response: forumId=${forumId}, replyId=${replyId}, responseId=${responseId}, userId=${userId}, role=${role}`);
  
      const forum = await Forum.findById(forumId);
      if (!forum) return res.status(404).json({ message: "Forum not found" });
  
      const reply = forum.replies.id(replyId);
      if (!reply) return res.status(404).json({ message: "Reply not found" });
  
      const responseIndex = reply.responses.findIndex((r) => r._id.toString() === responseId);
      if (responseIndex === -1) return res.status(404).json({ message: "Response not found" });
  
      // Check if the user is authorized to delete (only admin or original responder)
      if (role !== "admin" && role !== "instructor" && reply.responses[responseIndex].admin.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized to delete response" });
      }
  
      reply.responses.splice(responseIndex, 1); // Remove response from array
      await forum.save(); // Save the updated forum
  
      res.json({ message: "Response deleted successfully" });
    } catch (error) {
      console.error("Error deleting response:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
