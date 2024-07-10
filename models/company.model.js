const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
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
		images: {
			profile: {
				type: String
			},
			cover: {
				type: String
			}
		},
		price: {
			type: Boolean,
			default: false
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		}
	},
	{ timestamps: true }
);

companySchema.index({ owner: 1 }, { unique: true });

module.exports = mongoose.model("Company", companySchema);
