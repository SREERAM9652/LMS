const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  discussion: { type: mongoose.Schema.Types.ObjectId, ref: "Discussion", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Reply = mongoose.model("Reply", ReplySchema);
module.exports = Reply;
