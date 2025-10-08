const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().populate("createdBy", "name"); // Populate instructor details
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/courses
// @desc    Add a new course (Image URL instead of file upload)
router.post("/", async (req, res) => {
    try {
        const { title, desc, price, img, createdBy } = req.body; // Image URL is provided directly

        

        const newCourse = new Course({ title, desc, price, img, createdBy });
        await newCourse.save();

        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
router.delete("/:id", async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting course", error });
    }
});


// Update Course
router.put("/:id", async (req, res) => {
    try {
        const { title, desc, price, img  } = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { title, desc, price, img },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: "Error updating course", error });
    }
});


module.exports = router;
