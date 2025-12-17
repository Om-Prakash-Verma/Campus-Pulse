"use client";

import { z } from "zod";

// Defines the Zod schema for the login form.
export const loginSchema = z.object({
  // Validates the 'name' field, ensuring it's a non-empty string.
  name: z.string().min(1, "Club name is required"),
  // Validates the 'password' field, ensuring it's a non-empty string.
  password: z.string().min(1, "Password is required"),
});

// Defines the Zod schema for the registration form.
export const registerSchema = z.object({
  // Validates the 'name' field, ensuring it's a string with at least 3 characters.
  name: z.string().min(3, "Club name must be at least 3 characters"),
  // Validates the 'password' field, ensuring it's a string with at least 4 characters.
  password: z.string().min(4, "Password must be at least 4 characters"),
  // Validates the 'category' field, ensuring it's one of the predefined enum values.
  category: z.enum(["Academic", "Sports", "Social", "Tech", "Music"]),
  // Validates the 'logo' field, which is an optional string.
  logo: z.string().optional(),
});
