const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
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
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		profile: {
			type: String
		},
	},
	{ timestamps: true }
);

employeeSchema.index({ email: 1, company: 1 }, { unique: true });

module.exports = mongoose.model("Employee", employeeSchema);
