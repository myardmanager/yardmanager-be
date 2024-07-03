const { check } = require("express-validator");

exports.validateUserWithCompany = [
	check("user.name.first").notEmpty().withMessage("First name is required"),
	check("user.name.last").notEmpty().withMessage("Last name is required"),
	check("user.username")
		.notEmpty()
		.withMessage("Username is required")
		.isLength({ min: 5 })
		.withMessage("Username must be at least 5 characters long")
		.isAlphanumeric()
		.withMessage("Username must contain only letters and numbers"),
	check("user.email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Please enter a valid email address"),
	check("user.password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.matches(/\d/)
		.withMessage("Password must contain a number")
		.matches(/[!@#$%^&*]/)
		.withMessage("Password must contain a special character"),
	check("company.name").notEmpty().withMessage("Company name is required"),
	check("company.address").notEmpty().withMessage("Company address is required"),
	check("company.phone").notEmpty().withMessage("Company phone is required")
];
