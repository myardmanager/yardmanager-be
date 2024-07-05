const mongoose = require("mongoose");
const roles = require("../constants/roles.constants.json");

// const ROLES_NAME = ["employees", "invoices", "inventory", "parts", "settings", "locations", "recycled", "roles"];

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
          enum: roles.privileges
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
		],
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true
		}
	},
	{ timestamps: true }
);

// exports.ROLES_NAME = ROLES_NAME;

module.exports = mongoose.model("Role", roleSchema);
