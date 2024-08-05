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
		username_1: {
			type: String,
			required: false,
			unique: false
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

userSchema.clearIndexes();
userSchema.index(false);
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
