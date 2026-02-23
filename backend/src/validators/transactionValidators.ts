import { body, query } from "express-validator";

export const createTransactionValidator = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be either income or expense"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ max: 100 })
    .withMessage("Category must not exceed 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  body("date")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
];

export const updateTransactionValidator = [
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be either income or expense"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Category must not exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
];

export const listTransactionsValidator = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
  query("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be either income or expense"),
  query("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
];
