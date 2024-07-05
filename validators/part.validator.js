const { check } = require("express-validator");

exports.validatePart = [
	check("name")
		.notEmpty()
		.withMessage("Name is required")
		.isString()
		.withMessage("Name must be a string")
		.isLength({ min: 2 })
		.withMessage("Name must be at least 2 characters long"),
	check("color").optional().isBoolean().withMessage("Color must be a boolean"),
	check("variant")
		.optional()
		.isArray()
		.withMessage("Variant must be an array")
		.custom((value) => {
			for (let i = 0; i < value.length; i++) {
				if (typeof value[i] !== "string") {
					return false;
				}
			}
			return true;
		})
		.withMessage("Variant must contain only strings")
];

exports.validatePartUpdate = [
	check("name")
		.optional()
		.isString()
		.withMessage("Name must be a string")
		.isLength({ min: 2 })
		.withMessage("Name must be at least 2 characters long"),
	check("color").optional().isBoolean().withMessage("Color must be a boolean"),
	check("variant")
		.optional()
		.isArray()
		.withMessage("Variant must be an array")
		.custom((value) => {
			for (let i = 0; i < value.length; i++) {
				if (typeof value[i] !== "string") {
					return false;
				}
			}
			return true;
		})
		.withMessage("Variant must contain only strings")
];
