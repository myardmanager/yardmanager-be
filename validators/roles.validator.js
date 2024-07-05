const { check, body } = require("express-validator");
const roles = require("../constants/roles.constants.json");
// const { ROLES_NAME } = require("../models/role.model");

exports.validateRole = [
	check("name")
		.exists()
		.withMessage("Name is required")
		.isString()
		.withMessage("Name must be a string"),
	body("privileges.*.name")
		.exists()
		.withMessage("Privilege name is required")
		.isString()
		.withMessage("Privilege name must be a string")
		.custom((value, { req }) => roles.privileges.includes(value))
		.withMessage("Invalid privilege name"),
	body("privileges.*.permissions.read")
		.exists()
		.withMessage("Privilege read permission is required")
		.isBoolean()
		.withMessage("Privilege read permission must be a boolean"),
	body("privileges.*.permissions.write")
		.exists()
		.withMessage("Privilege write permission is required")
		.isBoolean()
		.withMessage("Privilege write permission must be a boolean"),
	body("privileges.*.permissions.delete")
		.exists()
		.withMessage("Privilege delete permission is required")
		.isBoolean()
		.withMessage("Privilege delete permission must be a boolean"),
	body("privileges.*.permissions.update")
		.exists()
		.withMessage("Privilege update permission is required")
		.isBoolean()
		.withMessage("Privilege update permission must be a boolean")
];

exports.validateUpdateRole = [
	check("name")
		.optional()
		.isString()
		.withMessage("Name must be a string"),
	body("privileges.*.name")
		.optional()
		.isString()
		.withMessage("Privilege name must be a string")
		.custom((value, { req }) => {
			return roles.privileges.includes(value);
		})
		.withMessage("Invalid privilege name"),
	body("privileges.*.permissions.*")
		.optional()
		.isBoolean()
		.withMessage("Privilege permission must be a boolean")
];
