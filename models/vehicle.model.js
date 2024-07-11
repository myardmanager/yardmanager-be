const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
	{
		vin: {
			type: String,
			required: true,
			unique: true
		},
		year: {
			type: Number,
			required: true
		},
		make: {
			type: String,
			required: true
		},
		model: {
			type: String,
			required: true
		},
		color: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		odometer: {
			type: Number,
			required: true
		},
		notes: {
			type: String
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true
		},
		location: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Location",
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

module.exports = mongoose.model("Vehicle", vehicleSchema);
