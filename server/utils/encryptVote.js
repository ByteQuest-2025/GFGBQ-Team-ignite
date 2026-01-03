const crypto = require("crypto");

const encryptVote = (candidateId, sessionId) => {
  return crypto
    .createHmac("sha256", process.env.VOTE_SECRET)
    .update(`${candidateId}:${sessionId}:${Date.now()}`)
    .digest("hex");
};

module.exports = encryptVote;
