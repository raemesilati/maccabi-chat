// routes/messages.js
const express = require("express");
const router = express.Router();
const Database = require("../utils/database");
const { authenticate } = require("../middleware/auth");

// Get conversation history
router.get("/chats", authenticate, async (req, res) => {
  try {
    const chats = await Database.getMessagesByUser(req.user.id);
    if (!chats) {
      return res.status(404).json({ error: "Chats not found" });
    }
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Error fetching chats" });
  }
});

module.exports = router;
