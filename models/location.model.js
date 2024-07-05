const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
	{
		location: {
			type: String,
			required: true
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
