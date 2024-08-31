const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
	{
		location: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Location",
			required: true
		},
		part: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Part",
			required: true
		},
		startYear: {
			type: String,
		},
		lastYear: {
			type: String,
		},
		model: [
			{
				type: String
			}
		],
		make: [
			{
				type: String
			}
		],
		variant: [
			{
				type: String
			}
		],
		price: {
			type: Number,
			required: true,
			default: 0
		},
		notes: {
			type: String
		},
		images: [
			{
				type: String
			}
		],
		sku: {
			type: Number,
			default: 1
		},
		color: [{
			type: String
		}],
		deleted: {
			type: Boolean,
			default: false
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true
		}
	},
	{ timestamps: true }
);

inventorySchema.index({ vendor: 1, addedBy: 1 });

module.exports = mongoose.model("Inventory", inventorySchema);
