const express = require("express");
const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");
const User = require("../models/User");
const router = express.Router();

// ✅ Create an announcement (Admin only)
router.post("/create", async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    if (!userId || !title || !description) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only admins can create announcements." });
    }

    const newAnnouncement = new Announcement({
      title,
      description,
      createdBy: userId,
      date: new Date(),
    });

    await newAnnouncement.save();
    res.status(201).json({ message: "Announcement created successfully", announcement: newAnnouncement });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// ✅ Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 }); // Latest first
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// ✅ Update an announcement (Admin only)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, title, description } = req.body;

    console.log("Update request received for ID:", id, "with data:", req.body); // Debugging step

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid announcement ID format." });
    }

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only admins can update announcements." });
    }

    // Ensure title and description are included
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ error: "Announcement not found." });
    }

    res.json({ message: "Announcement updated successfully", announcement: updatedAnnouncement });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});


// ✅ Delete an announcement (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid announcement ID format." });
    }

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only admins can delete announcements." });
    }

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ error: "Announcement not found." });
    }

    res.json({ message: "Announcement deleted successfully!" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

module.exports = router;
