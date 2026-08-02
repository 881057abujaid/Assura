import { z } from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters long."),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address."),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters long.")
        .max(32, "Password cannot exceed 32 characters.")
});

export const loginSchema = z.object({
    email: z
        .email("Please enter a valid email address.")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters long.")
        .max(32, "Password cannot exceed 32 characters.")
});