const express = require("express");
const router = express.Router();
const Reply = require("../models/Reply");
const Discussion = require("../models/Discussion");

// Add a reply to a discussion
router.post("/", async (req, res) => {
  try {
      const { content, author, discussion } = req.body;
      const reply = new Reply({ content, author, discussion });
      await reply.save();

      await Discussion.findByIdAndUpdate(discussion, { $push: { replies: reply._id } });

      res.status(201).json({ message: "Reply added", reply });
  } catch (error) {
      res.status(500).json({ message: "Error adding reply", error });
  }
});

// Delete a reply
router.delete("/:id", async (req, res) => {
  try {
    await Reply.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Reply deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reply", error });
  }
});

module.exports = router;
