import { z } from "zod";
import { Gender } from "@prisma/client";

export const createCustomerSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address."),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters long.")
        .max(32, "Password cannot exceed 32 characters."),

    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters long.")
        .max(100, "Full name cannot exceed 100 characters."),

    phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Invalid phone number format.")
        .optional()
        .nullable(),

    dob: z
        .string()
        .optional()
        .nullable()
        .transform((val) => val ? new Date(val) : null)
        .refine((date) => !date || !isNaN(date.getTime()), "Invalid date format.")
        .refine((date) => {
            if (!date) return true;
            const age = new Date().getFullYear() - date.getFullYear();
            return age >= 18 && age <= 100;
        }, "Customer must be at least 18 years old."),

    gender: z.nativeEnum(Gender, {
        message: "Invalid gender."
    }).optional().nullable(),

    address: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters long.")
        .max(255, "Address cannot exceed 255 characters.")
        .optional()
        .nullable(),

    city: z
        .string()
        .trim()
        .min(2, "City must be at least 2 characters long.")
        .max(100, "City cannot exceed 100 characters.")
        .optional()
        .nullable(),

    state: z
        .string()
        .trim()
        .min(2, "State must be at least 2 characters long.")
        .max(100, "State cannot exceed 100 characters.")
        .optional()
        .nullable(),

    country: z
        .string()
        .trim()
        .min(2, "Country must be at least 2 characters long.")
        .max(100, "Country cannot exceed 100 characters.")
        .optional()
        .nullable(),

    postalCode: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Invalid postal code format.")
        .optional()
        .nullable(),
});

export const updateCustomerSchema = z.object({
    userId: z
        .string()
        .trim()
        .uuid({
            message: "Please provide a valid UUID."
        })
        .optional(),

    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters long.")
        .max(100, "Full name cannot exceed 100 characters.")
        .optional(),

    phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Invalid phone number format.")
        .optional(),

    dob: z
        .string()
        .transform((val) => new Date(val))
        .refine((date) => !isNaN(date.getTime()), "Invalid date format.")
        .refine((date) => {
            const age = new Date().getFullYear() - date.getFullYear();
            return age >= 18 && age <= 100;
        }, "Customer must be at least 18 years old.")
        .optional(),

    gender: z.nativeEnum(Gender, {
        message: "Invalid gender."
    }).optional(),

    address: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters long.")
        .max(255, "Address cannot exceed 255 characters.")
        .optional(),

    city: z
        .string()
        .trim()
        .min(2, "City must be at least 2 characters long.")
        .max(100, "City cannot exceed 100 characters.")
        .optional(),

    state: z
        .string()
        .trim()
        .min(2, "State must be at least 2 characters long.")
        .max(100, "State cannot exceed 100 characters.")
        .optional(),

    country: z
        .string()
        .trim()
        .min(2, "Country must be at least 2 characters long.")
        .max(100, "Country cannot exceed 100 characters.")
        .optional(),

    postalCode: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Invalid postal code format.")
        .optional(),
})
    .refine(
        (data) => Object.values(data).some(
            (value) => value !== undefined
        ),
        {
            message: "At least one field is required.",
        }
    );