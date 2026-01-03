const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voteHash: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Vote", voteSchema);
