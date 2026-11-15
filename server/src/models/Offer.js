const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    code: String,
    active: { type: Boolean, default: true },
    expiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);