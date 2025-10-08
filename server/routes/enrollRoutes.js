const express = require("express");
const Enrollment = require("../models/Enrollment"); // Assuming you have the Enrollment model
const Course = require("../models/Course"); // Assuming you have the Course model
const User = require("../models/User"); // Assuming you have the User model

const router = express.Router();

// Route to enroll a student in a course
router.post('/api/enroll-course', async (req, res) => {
    
    const { userId, courseId } = req.body; // Changed studentId to userId

    try {
        // Check if user exists
        const user = await User.findById(userId); // Changed studentId to userId
        if (!user) {
            return res.status(404).send('User not found.'); // Changed Student to User
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send('Course not found.');
        }

        // Check if the user is already enrolled
        const existingEnrollment = await Enrollment.findOne({ userId, courseId }); // Changed studentId to userId
        if (existingEnrollment) {
            return res.status(400).send('User is already enrolled in this course.'); // Changed Student to User
        }

        // Create the enrollment
        const enrollment = new Enrollment({
            userId, // Changed studentId to userId
            courseId,
        });

        await enrollment.save();
        res.status(200).send('Enrolled successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error enrolling in course.');
    }
});

// Route to unenroll a user from a course
router.delete('/api/unenroll-course', async (req, res) => {
    const { userId, courseId } = req.body; // Expecting userId and courseId in body

    if (!userId || !courseId) {
        return res.status(400).send('userId and courseId are required.');
    }

    try {
        // Check if the user is enrolled in the course
        const enrollment = await Enrollment.findOne({ userId, courseId });

        if (!enrollment) {
            return res.status(404).send('User is not enrolled in this course.');
        }

        // Unenroll the user from the course
        await Enrollment.findOneAndDelete({ userId, courseId });

        res.status(200).send('Unenrolled successfully!');
    } catch (error) {
        console.error("Error during unenrollment:", error);
        res.status(500).send('Error unenrolling from course.');
    }
});


// Route to get all courses a user is enrolled in
router.get('/api/enrolled-courses/:userId', async (req, res) => {
    const { userId } = req.params; // Changed studentId to userId

    try {
        // Fetch all enrollments for the user
        const enrollments = await Enrollment.find({ userId }); // Changed studentId to userId

        // If no enrollments found, send an empty array
        if (enrollments.length === 0) {
            return res.status(200).json([]);
        }

        // Extract courseIds from the enrollments
        const courseIds = enrollments.map(e => e.courseId);

        // Fetch the courses using courseIds
        const courses = await Course.find({ '_id': { $in: courseIds } });
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching enrolled courses.');
    }
});

module.exports = router; // Export the router
