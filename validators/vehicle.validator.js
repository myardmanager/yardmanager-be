const { check } = require("express-validator");

exports.validateVehicle = [
	check("vin")
		.notEmpty()
		.withMessage("VIN is required")
		.isString()
		.withMessage("VIN must be a string")
		.isLength({ min: 17, max: 17 })
		.withMessage("VIN must be exactly 17 characters long"),
	check("startYear")
		.notEmpty()
		.withMessage("Year is required")
		.isISO8601()
		.toDate()
		.withMessage("Year must be a valid date"),
	check("make")
		.notEmpty()
		.withMessage("Make is required")
		.isArray()
		.withMessage("Make must be an array")
		.custom((value) => {
			for (let i = 0; i < value.length; i++) {
				if (typeof value[i] !== "string") {
					return false;
				}
			}
			return true;
		})
		.withMessage("Make must contain only strings"),
	check("model")
		.notEmpty()
		.withMessage("Model is required")
		.isArray()
		.withMessage("Model must be an array")
		.custom((value) => {
			for (let i = 0; i < value.length; i++) {
				if (typeof value[i] !== "string") {
					return false;
				}
			}
			return true;
		})
		.withMessage("Model must contain only strings"),
	check("notes").optional().isString().withMessage("Notes must be a string")
];

exports.validateVehicleUpdate = [
	check("vin")
		.optional()
		.isString()
		.withMessage("VIN must be a string")
		.isLength({ min: 17, max: 17 })
		.withMessage("VIN must be exactly 17 characters long"),
	check("year").optional().isISO8601().toDate().withMessage("Year must be a valid date"),
	check("make").optional().isArray().withMessage("Make must be an array"),
	// .custom((value) => {
	//   for (let i = 0; i < value.length; i++) {
	//     if (typeof value[i] !== "string") {
	//       return false;
	//     }
	//   }
	//   return true;
	// })
	// .withMessage("Make must contain only strings")
	check("model").optional().isArray().withMessage("Model must be an array"),
	// .custom((value) => {
	//   for (let i = 0; i < value.length; i++) {
	//     if (typeof value[i] !== "string") {
	//       return false;
	//     }
	//   }
	//   return true;
	// })
	// .withMessage("Model must contain only strings")
	check("notes").optional().isString().withMessage("Notes must be a string"),
	check("company").optional().isMongoId().withMessage("Company must be a valid MongoDB ObjectId")
];
