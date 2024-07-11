const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
	{
		vin: {
			type: String,
			required: true,
			unique: true
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
		start_year: {
			type: Date,
			required: true
		},
		end_year: {
			type: Date,
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
