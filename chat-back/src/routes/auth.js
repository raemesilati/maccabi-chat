const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Database = require("../utils/database");
const { authenticate } = require("../middleware/auth"); // Add this line

// Register route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user exists
    const existingUser = await Database.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "המשתמש כבר רשום" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await Database.createUser({
      email,
      fullName,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Return user info and token (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "שגיאה ביצירת משתמש" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await Database.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "שם משתמש לא קיים" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "סיסמא לא נכונה" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Return user info and token (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "שגיאה בשרת, אנא נסה מאוחר יותר" });
  }
});

// Get all users
router.get("/users", authenticate, async (req, res) => {
  try {
    const users = await Database.getAllUsers();
    // Remove passwords and return users
    const safeUsers = users.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    res.json(safeUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "שגיאה במשיכת משתמשים" });
  }
});

// Get current user
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await Database.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "שגיאה במשיכת משתמש" });
  }
});

module.exports = router;
