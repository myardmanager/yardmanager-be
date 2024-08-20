const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
	{
		vin: {
			type: String,
			required: true,
			unique: true
		},
		sku: {
			type: Number,
			default: 0
		},
		name: {
			type: String
		},
		location: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Location"
			// required: true
		},
		part: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Part"
			// required: true
		},
		startYear: {
			type: String,
			// required: true
		},
		lastYear: {
			type: String
		},
		color: {
			type: String
		},
		make: [
			{
				type: String,
				required: true
			}
		],
		model: [
			{
				type: String,
				required: true
			}
		],
		variant: [
			{
				type: String,
				required: true
			}
		],
		notes: {
			type: String
		},
		images: [
			{
				type: String
			}
		],
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
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
