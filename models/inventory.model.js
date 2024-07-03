const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		location: {
			type: String,
			required: true
		},
		startYear: {
			type: String
		},
		lastYear: {
			type: String
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
    },
		color: {
			type: String
		},
		addedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		vendor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true
		}
	},
	{ timestamps: true }
);

inventorySchema.index({ vendor: 1, addedBy: 1 });


module.exports = mongoose.model("Inventory", inventorySchema);
