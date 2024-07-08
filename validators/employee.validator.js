exports.validateGetEmployee = [
	check("id").optional().isMongoId().withMessage("Invalid employee ID")
];

exports.validateEmployee = [
	check("name.first").notEmpty().withMessage("First name is required"),
	check("name.last").notEmpty().withMessage("Last name is required"),
	check("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Please enter a valid email address"),
	check("password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.matches(/\d/)
		.withMessage("Password must contain a number")
		.matches(/[!@#$%^&*]/)
		.withMessage("Password must contain a special character"),
	check("role").notEmpty().withMessage("Role is required").isMongoId().withMessage("Role must be a valid MongoDB ObjectId"),
	check("position").notEmpty().withMessage("Position is required"),
];

exports.validateUpdateEmployee = [
	check("name.first").optional().notEmpty().withMessage("First name is required"),
	check("name.last").optional().notEmpty().withMessage("Last name is required"),
	check("email").optional().isEmail().withMessage("Please enter a valid email address"),
	check("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
	check("role").optional().isMongoId().withMessage("Role must be a valid MongoDB ObjectId"),
	check("position").optional().notEmpty().withMessage("Position is required")
];
