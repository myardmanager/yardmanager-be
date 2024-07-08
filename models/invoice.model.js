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
	if (!this.soldByUser && !this.soldByEmployee) {
		next(new Error("Invoice must contains soldBy from user or employee only one"));
	}
	if (this.soldByUser && this.soldByEmployee) {
		next(new Error("Invoice must contains soldBy from user or employee only one"));
	}
	next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
