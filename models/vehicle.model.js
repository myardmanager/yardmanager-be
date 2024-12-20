const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vin: {
      type: String,
      required: true,
      // unique: true
    },
    sku: {
      type: Number,
      default: 1,
    },
    name: {
      type: String,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      // required: true
    },
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      // required: true
    },
    startYear: {
      type: String,
      // required: true
    },
    lastYear: {
      type: String,
    },
    color: [
      {
        type: String,
      },
    ],
    make: [
      {
        type: String,
        required: true,
      },
    ],
    model: [
      {
        type: String,
        required: true,
      },
    ],
    variant: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      // required: true,
      default: 0,
    },
    notes: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByType",
      required: true,
    },
    createdByType: {
      type: String,
      enum: ["User", "Employee"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
