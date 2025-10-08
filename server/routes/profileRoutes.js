const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // Import mongoose
const User = require("../models/User");

// Route to fetch personal info
router.get("/personal-info/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // ✅ Ensure `userId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // ✅ Convert `userId` to `ObjectId` before querying
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      dob: user.dob ? user.dob.toISOString().split("T")[0] : null,
      gender: user.gender,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching personal info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to update personal information
// Route to update personal information
router.put('/update-personal-info/:userId', async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, phone, dob, gender, role } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Update the user's personal information
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.dob = dob ? new Date(dob) : user.dob; // Convert dob to Date object if it exists
    user.gender = gender || user.gender;
    user.role = role || user.role;

    // Save the updated user
    await user.save();
    res.status(200).json(user); // Return the updated user object
  } catch (error) {
    console.error("Error updating personal info:", error);
    res.status(500).send("Error updating personal info.");
  }
});




module.exports = router;
