"use client";

import { z } from "zod";

export const loginSchema = z.object({
  name: z.string().min(1, "Club name is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Club name must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  category: z.enum(["Academic", "Sports", "Social", "Tech", "Music"]),
  logo: z.string().optional(),
});
