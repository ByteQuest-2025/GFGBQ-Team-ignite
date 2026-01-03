import express from "express";
import crypto from "crypto";

const router = express.Router();

let activeSession = null;

router.post("/login", async (req, res) => {
  const { officerId, password } = req.body;

  if (officerId !== "officer123" || password !== "admin123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", role: "polling_officer" });
});

router.post("/start-session", (req, res) => {
  if (activeSession) {
    return res.status(400).json({ message: "Session already active" });
  }

  const sessionId = crypto.randomUUID();

  activeSession = {
    id: sessionId,
    startedAt: Date.now(),
  };

  res.json({
    message: "Voting session started",
    sessionId,
  });
});

router.post("/reset-session", (req, res) => {
  activeSession = null;
  res.json({ message: "Session reset successfully" });
});

router.get("/status", (req, res) => {
  res.json({
    active: Boolean(activeSession),
    sessionId: activeSession?.id || null,
  });
});

export default router;
