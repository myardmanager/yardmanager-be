const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			required: true
		},
		soldByUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		soldByEmployee: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Employee"
		},
		soldByAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin"
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Inventory",
					required: true
				},
				quantity: {
					type: Number,
					required: true
				},
				price: {
					type: Number,
					required: true
				},
				date: {
					type: Date,
					default: Date.now
				}
			}
		],
		tax: {
			type: Number,
			default: 0
		},
		// total: {
		// 	type: Number,
		// 	required: true
		// },
		paid: {
			type: Number,
			default: false
		},
		status: {
			type: Boolean,
			default: false
		},
		notes: {
			type: String
		},
		paymentMethod: {
			type: String
		},
		datePaid: {
			type: Date,
			default: Date.now
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true
		}
	},
	{ timestamps: true }
);

invoiceSchema.pre("validate", function (next) {
	if (!this.soldByUser && !this.soldByEmployee && !this.soldByAdmin) {
		next(new Error("Invoice must contains soldBy from user, employee or admin only one"));
	}
	if (this.soldByUser && this.soldByEmployee) {
		next(new Error("Invoice must contains soldBy from user, employee or admin only one"));
	}
	if (this.soldByUser && this.soldByAdmin) {
		next(new Error("Invoice must contains soldBy from user, employee or admin only one"));
	}
	if (this.soldByEmployee && this.soldByAdmin) {
		next(new Error("Invoice must contains soldBy from user, employee or admin only one"));
	}
	next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
