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
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Role",
			required: true
		},
		position: {
			type: String,
			required: true
		},
		profile: {
			type: String
		},
		date: {
			type: Date,
			default: Date.now
		},
		status: {
			type: Boolean,
			default: true
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true
		},
		createdByUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		createdByEmployee: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Employee"
		}
	},
	{ timestamps: true }
);

employeeSchema.index({ email: 1, company: 1 }, { unique: true });

employeeSchema.pre("validate", function (next) {
	if (!this.createdByUser && !this.createdByEmployee) {
		next(new Error("Invoice must contains soldBy from user or employee only one"));
	}
	if (this.createdByUser && this.createdByEmployee) {
		next(new Error("Invoice must contains soldBy from user or employee only one"));
	}
	next();
});

module.exports = mongoose.model("Employee", employeeSchema);
