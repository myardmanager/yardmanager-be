const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    expires: {
      type: Date,
      default: Date.now,
      expires: 300 // 5 minutes
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
