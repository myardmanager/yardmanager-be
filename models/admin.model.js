const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profile: {
      type: String,
    },
    cover: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
