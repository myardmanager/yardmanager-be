// validators\subscription.validator.js
const { check } = require("express-validator");

exports.validateCard = [
	check("number")
		.notEmpty()
		.withMessage("Card number is required")
		.isCreditCard()
		.withMessage("Card number must be a credit card number"),
	check("cvc")
		.notEmpty()
		.withMessage("CVC is required")
		.isInt()
		.withMessage("CVC must be a number")
    .length({ min: 3, max: 3 })
    .withMessage("CVC must be a three-digit number"),
	check("exp_month")
		.notEmpty()
		.withMessage("Expiration month is required")
		.isInt()
		.withMessage("Expiration month must be a number")
		.isLength({ min: 2, max: 2 })
		.withMessage("Expiration month must be a two-digit number"),
	check("exp_year")
		.notEmpty()
		.withMessage("Expiration year is required")
		.isInt()
		.withMessage("Expiration year must be a number")
		.isLength({ min: 4, max: 4 })
		.withMessage("Expiration year must be a four-digit number")
];
