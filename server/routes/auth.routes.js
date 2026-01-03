const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const router = express.Router();

let activeSession = null;

router.post("/login", (req, res) => {
  const { officerId, password } = req.body;

  if (officerId !== "officer123" || password !== "admin123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    role: "polling_officer",
  });
});

router.post("/session/start", (req, res) => {
  if (activeSession) {
    return res.status(400).json({ message: "Session already active" });
  }

  activeSession = {
    id: crypto.randomUUID(),
    startedAt: Date.now(),
  };

  res.json({
    message: "Voting session started",
    sessionId: activeSession.id,
  });
});

router.post("/session/reset", (req, res) => {
  activeSession = null;
  res.json({ message: "Session reset successfully" });
});

router.get("/session/status", (req, res) => {
  res.json({
    active: Boolean(activeSession),
    sessionId: activeSession?.id || null,
  });
});

router.get("/session/token", (req, res) => {
  const token = jwt.sign(
    { role: "voter" },
    process.env.JWT_SECRET
  );
  res.json({ token });
});

const getActiveSession = () => activeSession;

module.exports = {
  router,
  getActiveSession,
};
