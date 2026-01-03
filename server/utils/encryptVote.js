const crypto = require("crypto");

const encryptVote = (candidateId) => {
  const secret = process.env.VOTE_SECRET;

  return crypto
    .createHmac("sha256", secret)
    .update(candidateId + Date.now())
    .digest("hex");
};

module.exports = encryptVote;
