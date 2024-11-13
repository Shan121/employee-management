import { check } from "express-validator";

export const userLoginValidator = [
  check("email", "Email is required").isString().notEmpty(),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
