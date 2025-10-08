const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const Discussion = require("../models/Discussion");

// Like a discussion or reply
// Like a discussion
router.post("/", async (req, res) => {
    try {
        const { user, targetId, targetType } = req.body;

        const existingLike = await Like.findOne({ user, targetId, targetType });

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);

            // Remove user from discussion.likes
            if (targetType === "Discussion") {
                await Discussion.findByIdAndUpdate(
                    targetId,
                    { $pull: { likes: user } },
                    { new: true }
                );
            }

            return res.status(200).json({ message: "Disliked", liked: false, userId: user });
        } else {
            const newLike = new Like({ user, targetId, targetType });
            await newLike.save();

            // Add user to discussion.likes
            if (targetType === "Discussion") {
                await Discussion.findByIdAndUpdate(
                    targetId,
                    { $addToSet: { likes: user } },
                    { new: true }
                );
            }

            return res.status(201).json({ message: "Liked", liked: true, userId: user });
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

  

// Unlike a discussion or reply
router.delete("/", async (req, res) => {
  try {
    const { user, targetId } = req.body;
    await Like.findOneAndDelete({ user, targetId });
    res.status(200).json({ message: "Unliked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unliking", error });
  }
});

module.exports = router;
