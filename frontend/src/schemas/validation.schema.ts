import { z } from "zod";

export const signupSchema = z.object({
  _id: z.string().trim().optional(),
  name: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(255),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" })
    .max(255),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(255),
  age: z.coerce.number().min(1, { message: "Age is required" }).max(120),
  gender: z.enum(["male", "female"]).optional(),
  role: z.enum(["regular", "admin"]).optional(),
});

export type SignupValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required" }).max(255),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export type LoginValues = z.infer<typeof loginSchema>;
