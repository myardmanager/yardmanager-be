const { check } = require("express-validator");

exports.validateInvoice = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  check("phone").optional().isString().withMessage("Phone must be a string"),
  check("products")
    .notEmpty()
    .withMessage("Products is required")
    .custom((value) => {
      return value.length > 0;
    })
    .withMessage("Products cannot be empty"),
  check("products.*.product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Product must be a valid MongoDB ObjectId"),
  check("products.*.quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("products.*.price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number"),
  check("products.*.date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Product date must be a valid date"),
  check("tax")
    .notEmpty()
    .withMessage("Tax is required")
    .isNumeric()
    .withMessage("Tax must be a number"),
  check("paid")
    .notEmpty()
    .withMessage("Paid amount is required")
    .isNumeric()
    .withMessage("Paid amount must be a number"),
  check("status")
    .notEmpty()
    .withMessage("Status is required")
    .isBoolean()
    .withMessage("Status must be a boolean"),
  check("notes").optional().isString().withMessage("Notes must be a string"),
  check("datePaid")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date paid must be a valid date"),
];

exports.validateInvoiceUpdate = [
  check("name").optional().isString().withMessage("Name must be a string"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  check("phone").optional().isString().withMessage("Phone must be a string"),
  check("products")
    .optional()
    .isArray()
    .custom((value) => {
      return value.length === 0 || value.length > 0;
    })
    .withMessage("Products cannot be empty"),
  check("products.*.product")
    .optional()
    .isMongoId()
    .withMessage("Product must be a valid MongoDB ObjectId"),
  check("products.*.quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("products.*.price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number"),
  check("products.*.date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Product date must be a valid date"),
  check("tax").optional().isNumeric().withMessage("Tax must be a number"),
  check("paid")
    .optional()
    .isNumeric()
    .withMessage("Paid amount must be a number"),
  check("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean"),
  check("notes").optional().isString().withMessage("Notes must be a string"),
  check("datePaid")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date paid must be a valid date"),
];
