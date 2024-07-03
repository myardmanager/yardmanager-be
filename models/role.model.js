const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		privileges: [
			{
        name: {
          type: String,
          required: true,
          enum: ["employees", "invoices", "inventory", "parts", "settings", "locations", "recycled", "roles"]
        },
				permissions: {
					read: {
						type: Boolean,
						default: false
					},
					write: {
						type: Boolean,
						default: false
					},
					delete: {
						type: Boolean,
						default: false
					},
					update: {
						type: Boolean,
						default: false
					}
				}
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
