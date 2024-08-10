const { check } = require("express-validator");

exports.validateLocation = [
  check("location")
    .notEmpty()
    .withMessage("Location is required")
    .isString()
    .withMessage("Location must be a string")
    .isLength({ min: 1 })
    .withMessage("Location must be at least 5 characters long")
];
