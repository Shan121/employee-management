import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  console.log("err in error.ts:", err);

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "production") {
    let error: any = { ...err };

    error.message = err.message;

    // Wrong Mongoose Object ID Error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 404);
    }

    // Handle Mongoose Validation Error
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(
        (value: any) => value.message
      );
      error = new ErrorHandler(messages.join(", "), 400);
    }

    // Handle Mongoose Dublicate key error
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} error`;
      error = new ErrorHandler(message, 400);
    }

    // Handle wrong JWT error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid. Try again!";
      error = new ErrorHandler(message, 400);
    }

    // Handle Expired JWT error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web Token is expired";
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export default errorMiddleware;
