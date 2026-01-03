const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const Voter = require("../models/voter");
const Vote = require("../models/vote");
const encryptVote = require("../utils/encryptVote");
const { getActiveSession } = require("./auth.routes");

router.post("/cast", async (req, res) => {
  try {
    const { voterId, candidateId, sessionToken } = req.body;

 
    if (!voterId || !candidateId || !sessionToken) {
      return res.status(400).json({ message: "Invalid vote request" });
    }


    const activeSession = getActiveSession();
    if (!activeSession) {
      return res
        .status(403)
        .json({ message: "No active voting session" });
    }

    try {
      jwt.verify(sessionToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid session token" });
    }


    const voter = await Voter.findOne({ voterId });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    if (voter.hasVoted) {
      return res
        .status(403)
        .json({ message: "Duplicate vote detected" });
    }

    const voteHash = encryptVote(candidateId);

    await Vote.create({ voteHash });


    voter.hasVoted = true;
    await voter.save();

    return res.json({ message: "Vote successfully cast" });
  } catch (error) {
    console.error("Vote error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
