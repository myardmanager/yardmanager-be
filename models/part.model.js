const mongoose = require("mongoose");

const partSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		color: {
			type: Boolean,
      default: false
		},
		variant: [
			{
				type: String
			}
		],
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Part", partSchema);
