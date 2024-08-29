const mongoose = require("mongoose");
const databaseBackup = require("../cron/databaseBackup.cron");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    images: {
      profile: {
        type: String,
      },
      cover: {
        type: String,
      },
    },
    price: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

companySchema.index({ owner: 1 }, { unique: true });

// companySchema.post(/Update$/, function (doc) {
//   if (doc.active) {
//     // databaseBackup.feeGenerator.start();
//     databaseBackup.feeGenerator.stop();
//   } else {
//     databaseBackup.feeGenerator.stop();
//   }
// });

module.exports = mongoose.model("Company", companySchema);
