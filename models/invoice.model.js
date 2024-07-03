const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    parts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part"
      }
    ],
    total: {
      type: Number,
      required: true
    },
    paid: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
