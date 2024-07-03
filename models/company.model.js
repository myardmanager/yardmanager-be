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
		image: {
			type: String
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		employees: [
			{
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Employee",
					required: true
				},
				role: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Role",
					required: true
				}
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
