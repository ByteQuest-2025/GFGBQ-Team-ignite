const express = require("express");
const router = express.Router();


const encryptVote = require("../utils/encryptVote");


router.post("/cast", async (req, res) => {
  try {
    const { voterId, candidateId, sessionToken } = req.body;

    if (!voterId || !candidateId || !sessionToken) {
      return res.status(400).json({ message: "Invalid vote request" });
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


    await Vote.create({
      voteHash
    });

   
    voter.hasVoted = true;
    await voter.save();

    return res.json({
      message: "Vote successfully cast"
    });
  } catch (error) {
    console.error("Vote error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
