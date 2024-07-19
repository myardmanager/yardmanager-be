const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			first: {
				type: String,
				required: true
			},
			last: {
				type: String,
				required: true
			}
		},
		username: {
			type: String,
			required: true,
			unique: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		profile: {
			type: String
		},
		lastLogin: {
			type: Date
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
